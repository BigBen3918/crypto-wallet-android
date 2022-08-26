import React from "react"
import Icon from "../components/Icon"
import AuthLayout from "../layouts/AuthLayout"
import { Content, Wrap } from "../components/commons"
import { colors, grid, gstyle, h, w } from "../components/style"
import { DefaultButton, Loading, Stepper } from "../components/elements"
import { secretPhrase as style } from "../components/StyledComponents"
import { createMnemonic } from '../../library/wallet';

interface SecretPhraseStatus {
	showPhrase:	boolean
	mnemonic:	string[]
	loading:	boolean
}
		
export default function ({route,  navigation }: any) {
	const {password} = route.params;
	const [status, setStatus] = React.useState<SecretPhraseStatus>({
		showPhrase:	false,
		mnemonic:	[],
		loading:	true
	})
	const updateStatus = (params:Partial<SecretPhraseStatus>) => setStatus({...status, ...params});

	const goBack = () => { 
		navigation?.goBack()
	}

	const submit = () => { 
		navigation?.navigate('ConfirmPhrase', {password, mnemonic: status.mnemonic})
	}

	const viewPhrase = () => {
		updateStatus({showPhrase: true})
	}

	const init = () => {
		let phrase =  createMnemonic();
		let flag = true;
		while(flag) {
			const arr =phrase.split(" ");
			const set = new Set(arr)
			if(set.size !== arr.length) {
				phrase = createMnemonic()
			} else {
				flag = false;
				break;
			}
		}
		updateStatus({mnemonic: phrase.split(' '), loading: false})
	}
		
	React.useEffect(() => {
		init()
	}, [])
		

	return (
		<>
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
				title="Write down your secret recovery phrase"
			>
				<Wrap style={{marginTop: h(5)}}>
					<Content style={gstyle.textLightCenter}>This is your Secret Recovery Phrase. Write it down on a paper and keep it in a safe place. You’ll be asked to re-enter this phrase (in order) on the next step.</Content>
					<Wrap style={grid.panel}>
						{!status.showPhrase ? (
							<>
								<Wrap style={{...grid.rowCenterCenter, ...grid.gridMargin1}}>
									<Icon.EyeInvisible color={colors.warning} />
								</Wrap>
								<Content style={{...gstyle.textLightLgCenter, textTransform: "uppercase"}}>Tap to reveal your Secret Recovery Phrase</Content>
								<Content style={gstyle.textLightCenter}>Make sure no one is watching your screen.</Content>
								<Wrap style={grid.btnGroup}>
									<DefaultButton btnProps={{onPress: viewPhrase}}><Content>Wrap</Content></DefaultButton>
								</Wrap>
							</>
						) : (
							<Wrap style={{...grid.rowCenterCenter}}>
								{status.mnemonic.map((i:string, k: number) => {
									if((k % 6) === 0)
										return (
											<Wrap key={k} style={grid.colBetween}>
												{status.mnemonic.slice(k, k + 6).map((ii, kk) => (
													<Wrap key={kk} style={style.word}>
														<Content style={{...gstyle.labelWhite, width: w(6)}}>{k + kk + 1}</Content>
														<Content style={{...gstyle.labelWhite}}>{ii}</Content>
													</Wrap>
												))}
											</Wrap>
										)
									return null
								})}
							</Wrap>
						)}
					</Wrap>
				</Wrap>
				<Wrap>
					<Wrap style={grid.btnGroup}>
						<DefaultButton btnProps={{onPress: submit}}><Content>Continue</Content></DefaultButton>
					</Wrap>
				</Wrap>
			</AuthLayout>
			
			{
				status.loading ? <Loading /> : <></>
			}
		</>
	);
}
