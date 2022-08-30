import React from "react"
import Icon from "../components/Icon";
import { DefaultButton, Stepper } from "../components/elements";
import { colors, grid, gstyle, h, w } from "../components/style";
import { Content, OpacityButton, Wrap } from "../components/commons";
import AuthLayout from "../layouts/AuthLayout";

interface SwapStatus {
	isMatch:		boolean
	focusIndex:		number
	selectedItems:	string[]
	mnemonic:		string[]
	showWords:		string[]
	password:		string
}

export default function ({route,  navigation }: any) {
	const [status, setStatus] = React.useState<SwapStatus>({
		isMatch:		false,
		focusIndex:		0,
		selectedItems:	Array(route.params.mnemonic.length).fill(""),
		mnemonic:		[],
		showWords:		[],
		password:		''
	})

	const updateStatus = (params:Partial<SwapStatus>) => setStatus({...status, ...params});

	React.useEffect(() => {
		const {password, mnemonic} = route.params;
		const m = mnemonic;
		const words = new Array(...mnemonic);
		updateStatus({mnemonic:m, showWords: words.sort(), password})
	}, [])

	const goBack = () => { 
		navigation?.goBack()
	}

	const submit = async () => { 
		navigation?.navigate('SecureSuccess', {password:status.password, mnemonic: status.mnemonic.join(" ")})
	}

	const reset = () => {
		updateStatus({selectedItems: Array(status.mnemonic.length).fill(""),  focusIndex:0})
	}

	const pressWord = (word:string, index:number) => {
		let items = status.selectedItems
		let fi = status.focusIndex

		const wi = items.indexOf(word)
		if(wi === -1) {
			items[fi] = word
			fi = items.indexOf("")
		} else {
			items[wi] = ""
			fi = wi
		}
		let flag = true;
		for(let i = 0; i<items.length; i++){
			if(items[i] !== status.mnemonic[i]) flag=false;
		}
		updateStatus({
			isMatch: flag,
			focusIndex: fi,
			selectedItems: items
		})
	}

	return (
		<AuthLayout
			onBack={goBack}
			content={
				<Stepper
					data={[
						{label: "Create Password"}, 
						{label: "Secure Wallet"},
						{label: "Confirm Secure Recovery Phrase"}
					]} 
					step={2} 
				/>
			}
			title="Confirm secret recovery phrase"
		>
			<Content style={gstyle.textLightCenter}>Select each word in the order it was </Content>
			<Content style={gstyle.textLightCenter}>presented to you.</Content>
			<Wrap style={{...grid.panel}}>
				<Wrap style={grid.rowCenter}>
					{status.mnemonic.map((i:string, k: number) => {
						if((k % 6) === 0)
							return (
								<Wrap key={k} style={grid.colBetween}>
									{status.mnemonic.slice(k, k + 6).map((ii, kk) => (
										<Wrap key={kk} style={{...grid.rowCenterCenter, marginBottom: h(1)}}>
											<Content style={{...gstyle.labelWhite, width: w(6)}}>{k + kk + 1}</Content>
											<Wrap 
												style={{
													display: "flex",
													justifyContent: "center",
													alignItems: "center",
													width: w(25),
													height: h(4),
													borderWidth: w(0.2),
													borderRadius: w(2),
													borderStyle: status.selectedItems[k + kk] !== "" ? "solid" : "dashed",
													borderColor: (status.selectedItems[k + kk] !== "" || status.focusIndex === k + kk) ? colors.bgButton : colors.bgSecondary
												}}
											>
												<Content style={gstyle.labelWhite}>{status.selectedItems.length >= (k + kk + 1) ? status.selectedItems[k + kk] : ""}</Content>
											</Wrap>
										</Wrap>
									))}
								</Wrap>
							)
						return null
					})}
				</Wrap>
			</Wrap>
			<Wrap style={grid.gridMargin2}>
				{!status.isMatch ? (
					<Wrap style={grid.colBetween}>
						{status.showWords.map((i:string, k: number) => {
							if((k % 3) === 0)
								return (
									<Wrap key={k} style={{...grid.rowCenterAround, marginBottom: h(1)}}>
										{status.showWords.slice(k, k+3).map((ii, kk) => (
											<OpacityButton 
												key={kk} 
												style={{
													display: "flex",
													flexDirection: "row",
													alignItems: "center",
													justifyContent: "center",
													width: w(25),
													height: h(6),
													paddingTop: h(1),
													paddingBottom: h(1),
													backgroundColor: status.selectedItems.indexOf(ii) !== -1 ? colors.bgModal : colors.bgLight,
													borderWidth: w(0.2),
													borderRadius: w(2),
													borderColor: status.selectedItems.indexOf(ii) !== -1 ? "transparent" : colors.color,
												}} 
												onPress={() => pressWord(ii, k+kk)}
											>
												<Content style={{color: status.selectedItems.indexOf(ii) !== -1 ? colors.color : colors.white}}>{ii}</Content>
											</OpacityButton>
										))}
									</Wrap>
								)
							return null
						})}
					</Wrap>
				):(
					<Wrap style={{...grid.rowCenterCenter, ...grid.gridMargin2}}>
						<Wrap 
							style={{
								...grid.rowCenterCenter,
								borderColor: colors.bgButton,
								borderWidth: w(0.2),
								paddingLeft: w(5),
								paddingRight: w(5),
								borderRadius: w(10)
							}}
						>
							<Wrap style={{marginTop: h(1.5)}}>
								<Icon.Check color={colors.bgButton} />
							</Wrap>
							<Content style={gstyle.link}>SUCCESS!</Content>
						</Wrap>
					</Wrap>
				)}
			</Wrap>
			{
				status.isMatch ?
				<Wrap style={grid.btnGroup}>
					<DefaultButton btnProps={{onPress: submit}}><Content>COMPLETE BACKUP</Content></DefaultButton>
				</Wrap>
				:
				<Wrap style={grid.btnGroup}>
					<DefaultButton btnProps={{onPress: reset}}><Content>RESET</Content></DefaultButton>
				</Wrap>
			}
		</AuthLayout>
	);
}
