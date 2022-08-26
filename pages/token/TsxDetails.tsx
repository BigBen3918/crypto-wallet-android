import React from "react"
import { colors, grid, gstyle, h,  w } from "../components/style"
import { Content, OpacityButton, Wrap } from "../components/commons"
import Icon from "../components/Icon"
import Avatar from "../components/avatar"
import FunctionLayout from "../layouts/FunctionLayout"
import { formatUnit } from "../../library/bigmath"
import useStore, { copyToClipboard, ellipsis, roundNumber } from "../../useStore"
 

export default function ({route, navigation}: {route: any, navigation: any}) {
	const {tx} = route.params as {tx: Transaction};

	const {setting, accounts, networks, currentNetwork, currentAccount, showToast} = useStore()

	const viewOnExplorer = () => {
		Object.values(networks).map((network) => {
			if( network.chainKey === currentNetwork){
				const url = network.url + "tx/"+tx.transactionId			
				navigation.navigate("WebView", {url: url})
			}	
		})
	}

	return (
		<FunctionLayout
			title={(tx?.from.toLowerCase()) === currentAccount.toLowerCase() ? 'SEND' : 'RECEIVE'}
			onBack={() => navigation.navigate("WalletTokens")}
			hideClose
			content={
				<Wrap style={{...grid.rowCenter, marginLeft: w(5)}}>
					<OpacityButton style={grid.rowCenter} onPress={() => navigation.goBack()}>
						<Wrap style={{marginRight: w(1)}}>
							<Icon.ArrowLeft color={colors.warning} width={w(4)} height={w(4)} />
						</Wrap>
						<Content style={gstyle.link}>Back</Content>
					</OpacityButton>
				</Wrap>
			}
		>
			<Wrap style={{paddingLeft: w(5), paddingRight: w(5)}}>
				<Wrap style={{...grid.rowCenterCenter}}>
					<Content style={gstyle.labelWhite}>STATUS: </Content>
					<Content style={{...gstyle.labelWhite, color: colors.placeholder}}>{tx.status}</Content>
				</Wrap>
				<OpacityButton onPress={() => {viewOnExplorer()}}><Content style={{...gstyle.textCenter, color:colors.warning, marginBottom: h(1)}}>View on explorer</Content></OpacityButton>
				<OpacityButton onPress={() => {copyToClipboard(tx.transactionId); showToast("Copied transaction id")}}><Content style={{...gstyle.textCenter, color:colors.warning, marginBottom: h(1)}}>Copy to Transaction ID</Content></OpacityButton>
				<Wrap style={grid.rowCenterAround}>
					<Wrap style={{flex: 1, paddingRight: w(5), paddingLeft: w(5)}}>
						<Wrap style={{backgroundColor: colors.bgSecondary, paddingTop: h(2), paddingBottom: h(2)}}>
							<Wrap style={{ alignSelf: "center"}}>
								<Avatar size={10} type={setting.identicon === "jazzicons" ? "Zazzicon" : "Blockies"} address={tx.from} />
							</Wrap>
							<Content style={{...gstyle.textLightCenterUppercase, marginBottom: h(0)}}>
								{
									tx.from.toLowerCase() === currentAccount.toLowerCase() ? Object.entries(accounts).map(([index, account]) => {
										if(account.address.toLowerCase() === tx.from.toLowerCase()) return account.label
									}) : ellipsis(tx.from)
								}
							</Content>
						</Wrap>
					</Wrap>
					<Wrap style={{...grid.rowCenterCenter, width: w(10), height: h(5), backgroundColor: colors.bgLight, borderRadius: w(1)}}>
						<Wrap style={{marginLeft: w(3), paddingTop: h(0.3)}}>
							<Icon.ArrowRight  width={w(5)} height={w(5)} />
						</Wrap>
					</Wrap>
					<Wrap style={{flex: 1, paddingRight: w(5), paddingLeft: w(5)}}>
						<Wrap style={{backgroundColor: colors.bgSecondary, paddingTop: h(2), paddingBottom: h(2)}}>
							<Wrap style={{...grid.gridMargin1, alignSelf: "center"}}>
							<Avatar size={10} type={setting.identicon === "jazzicons" ? "Zazzicon" : "Blockies"} address={tx.to} />
							</Wrap>
							<Content style={{...gstyle.textLightCenterUppercase, marginBottom: h(0)}}>
								{
									tx.to.toLowerCase() === currentAccount.toLowerCase() ? Object.entries(accounts).map(([index, account]) => {
										if(account.address.toLowerCase() === tx.to.toLowerCase()) return account.label
									}) : ellipsis(tx.to)
								}
							</Content>
						</Wrap>
					</Wrap>
				</Wrap>
				<Content style={{...gstyle.linkCenter, fontSize: w(8), marginTop: w(1)}}>
					{` ${roundNumber(formatUnit(tx?.amount || '0', Number(tx?.decimals || 0)))} ${tx?.symbol}`}
				</Content>
			   
				<Wrap>
					<Content style={{...gstyle.labelWhite}}>Transaction</Content>
					<Wrap style={gstyle.hr} />
					<Wrap style={grid.gridMargin1}>
						<Wrap style={grid.rowCenterBetween}>
							<Content style={gstyle.label}>Nance</Content>
							<Content style={gstyle.label}>{Number(tx?.nonce)}</Content>
						</Wrap>
					</Wrap>
					<Wrap style={grid.gridMargin1}>
						<Wrap style={grid.rowCenterBetween}>
							<Content style={gstyle.label}>Amount</Content>
							<Content style={gstyle.label}>{` ${roundNumber(formatUnit(tx?.amount || '0', Number(tx?.decimals || 0)))} ${tx?.symbol}`}</Content>
						</Wrap>
					</Wrap>
					<Wrap style={grid.gridMargin1}>
						<Wrap style={grid.rowCenterBetween}>
							<Content style={gstyle.label}>Gas Limit (Units)</Content>
							<Content style={gstyle.label}>{Number(tx?.gasLimit || '0')}</Content>
						</Wrap>
					</Wrap>
					<Wrap style={grid.gridMargin1}>
						<Wrap style={grid.rowCenterBetween}>
							<Content style={gstyle.label}>Gas Used (Units)</Content>
							<Content style={gstyle.label}>{Number(tx?.gasUsed || '0')}</Content>
						</Wrap>
					</Wrap>
					<Wrap style={grid.gridMargin1}>
						<Wrap style={grid.rowCenterBetween}>
							<Content style={gstyle.label}>Gas price</Content>
							<Content style={gstyle.label}>{formatUnit(tx?.gasPrice || '0', 9)}</Content>
						</Wrap>
					</Wrap>
					<Wrap style={gstyle.hr} />
					<Wrap style={grid.gridMargin2}>
						<Wrap style={grid.rowCenterBetween}>
							<Content style={gstyle.label}>Total</Content>
							<Wrap>
								<Content style={gstyle.labelWhite}>{roundNumber(formatUnit(tx?.amount || '0', Number(tx?.decimals || 0)))}  {tx?.symbol}</Content>
							</Wrap>
						</Wrap>
					</Wrap>
				</Wrap>
			</Wrap>
		</FunctionLayout>
	)
}