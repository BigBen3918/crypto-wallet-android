import React from "react"
import axios from "axios"
import { ethers } from "ethers"
import { isValidAddress } from "ethereumjs-util"
import { Content, Wrap } from "../components/commons"
import FunctionLayout from "../layouts/FunctionLayout"
import { colors, grid, gstyle, h, w } from "../components/style"
import { DefaultButton, DefaultInput, Loading } from "../components/elements"
import useStore from '../../useStore'
import {  checkNFT } from "../../library/wallet"


interface NFTStatus {
	address:			string
	tokenId:			string
	tokenUri:			string
	name:				string
	imageUri:			string
	symbol:				string
	loading:			boolean;
}
export default function ({ navigation }: any) {
		
	const {currentAccount, currentNetwork, networks, nfts, update, showToast} = useStore()

	const [status, setStatus] = React.useState<NFTStatus>({
		address:		"",
		tokenId:		"",
		tokenUri:		"",
		imageUri:		"",
		name:			"",
		symbol:			"",
		loading:		false
	})

	const updateStatus = (params:Partial<NFTStatus>) => setStatus({...status, ...params});

	const goBack = () => { 
		navigation?.navigate('WalletTokens')
	}

	const importNFT = async () => {
		if(!isValidAddress(status.address)) return showToast("Invalid contract address", "warning")
		if(status.tokenId.trim() === "" || !ethers.BigNumber.isBigNumber(ethers.BigNumber.from(status.tokenId))) return showToast("Invalid token id", "warning")
		updateStatus({loading: true})
		let rpc = null;
		Object.entries(networks).map(([index, network]) => {
			if( network.chainKey === currentNetwork){
				rpc = network.rpc;
			}
		})
		if(rpc !== null) {
			const res = await checkNFT(rpc, status.address, ethers.BigNumber.from(status.tokenId).toString())
			if(res?.uri) {
				if(currentAccount.toLowerCase() !== res.owner.toLowerCase()) {
					updateStatus({loading: false})
					return showToast("Not owner of the NFT", "warning")
				}
				const response = await axios.get(res.uri)
				const data = (response.data)
				if(data) {
					const img = data?.['image'];
					let newNFTs = {} as {[chainKey: string]: NFTObject[]};
					if(nfts && Object.entries(nfts).length> 0) { 
						let flag = false;
						Object.entries(nfts).map(([chainKey, tks]) => {
								if(chainKey !== currentNetwork) newNFTs[chainKey] = tks;
								else {
									let newTks: NFTObject[] = [];
									let exists = false;
									tks.map((n, index) => {
										newTks.push(n)
										if(n.contract == status.address && n.tokenId == status.tokenId) exists = true
									})
									if(!exists) newTks.push({
										owner:				currentAccount,
										contract:			status.address,
										tokenId:			status.tokenId,
										name:				res.name,
										symbol:				res.symbol,
										imageUri:			img,
										tokenUri:			res.uri,
										favourite:			false,
										importedTime:		+new Date()
									})
									newNFTs[chainKey] = newTks;
									flag = true;
								}
							})
							if(!flag) {
								newNFTs[currentNetwork] = [
									{
										owner:				currentAccount,
										contract:			status.address,
										tokenId:			status.tokenId,
										name:				res.name,
										symbol:				res.symbol,
										imageUri:			img,
										tokenUri:			res.uri,
										favourite:			false,
										importedTime:		+new Date()
									}
								];
							}
					} else {
						let newNFT: NFTObject[] = [];
						newNFT = [
							{
								owner:				currentAccount,
								contract:			status.address,
								tokenId:			status.tokenId,
								name:				res.name,
								symbol:				res.symbol,
								imageUri:			img,
								tokenUri:			res.uri,
								favourite:			false,
								importedTime:		+new Date()
							}
						]
						newNFTs[currentNetwork] = newNFT; 
					}
					update({nfts: newNFTs})
					updateStatus({tokenUri: res?.uri || "", imageUri: img, name: res?.name, symbol: res?.symbol, loading: false})
					navigation.navigate("WalletTokens")
					return;
				}
			}
		}
		updateStatus({loading: false})
		showToast("Could not found NFT infomation", "warning")
	}
		
	return (
		<>
			<FunctionLayout
				navigation={navigation}
				title="IMPORT NFT"
				onBack={goBack}
			>
				<Wrap style={{alignSelf: "center",width: w(90), paddingTop: h(3), paddingBottom: h(3)}}>
					<Wrap style={{display: "flex", flexDirection: "row", alignItems: "center", paddingTop: h(2), paddingBottom: h(2), paddingLeft: w(3), paddingRight: w(3), backgroundColor: colors.bgLight, marginBottom: h(3)}}>
						<Wrap style={{flex: 1}}>
							<Content style={gstyle.label}>
								<Content style={{fontWeight: "700"}}>NFT detection</Content>
							</Content>
							<Content style={gstyle.label}>Allow ICICBWallet to automatically detect NFTs from OpenSea and display in your ICICB Wallet.</Content>
							<Content  style={gstyle.link}>
								<Content style={{fontWeight: "700"}}>Turn on NFT detection in Setting</Content>
							</Content>
						</Wrap>
					</Wrap>
					<DefaultInput
						label="Address"
						visibleValue={false}
						inputProps={{
							placeholder: "0x...",
							value: status.address,
							onChangeText: (txt:string) => updateStatus({address: txt}),
							style:{borderColor: colors.color, borderWidth: w(0.1)}
						}}
					/>
					<DefaultInput
						label="ID"
						visibleValue={false}
						inputProps={{
							placeholder: "Enter the collectible ID",
							value: status.tokenId,
							onChangeText: (txt:string) => updateStatus({tokenId: txt}),
							style:{borderColor: colors.color, borderWidth: w(0.1)}
						}}
					/>
					<Wrap style={{...grid.btnGroup, justifyContent:'space-around'}}>
						<DefaultButton width={40} btnProps={{onPress: goBack}}>Cancel</DefaultButton>
						<DefaultButton width={40} theme="warning" btnProps={{onPress: ()=>{importNFT()}}}>Import</DefaultButton>
					</Wrap>
				</Wrap>
			</FunctionLayout>
			{
				status.loading && <Loading />
			}
		</>
	)
}
