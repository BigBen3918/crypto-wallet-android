import React from "react"
import AuthLayout from "../layouts/AuthLayout";
import { DefaultButton, ProgressBar, Stepper } from "../components/elements";
import { Content, OpacityButton, Wrap } from "../components/commons";
import { colors, grid, gstyle, h, w } from "../components/style";
import Icon from "../components/Icon";

interface CreatePassStatus{
	showModal1:	boolean
	showModal2: boolean
}

export default function ({route, navigation }: any) {
	const {password} = route.params;

	const [status, setStatus] = React.useState<CreatePassStatus>({
		showModal1: false,
		showModal2: false
	})

	const updateStatus = (params:Partial<CreatePassStatus>) => setStatus({...status, ...params});

	const closeModal1 = () => {
		updateStatus({
			showModal1: false
		})
	}

	const closeModal2 = () => {
		updateStatus({
			showModal2: false
		})
	}

	const goBack = () => { 
		navigation?.goBack()
	}

	const goNext = () => { 
		navigation?.navigate('Support')
	}

	const submit = () => { 
		navigation?.navigate('ConfirmPass', {password})
	}

	return (
		<>
			<AuthLayout
				onBack={goBack}
				content={
					<>
						<Stepper
							data={[
								{label: "Create Password"}, 
								{label: "Secure Wallet"},
								{label: "Confirm Secure Recovery Phrase"}
							]} 
							step={1}
						/>
						<Wrap style={{...grid.rowCenterCenter, marginTop: h(4), marginBottom: h(-2)}}>
							<Icon.Lock color={colors.warning} width={w(7)} height={w(7)} />
						</Wrap>
					</>
				}
				title="Secure your wallet"
			>
				<Wrap>
					<Wrap style={grid.rowCenterCenter}>
						<Content style={{...gstyle.textLight}}>Secure your wallet’s </Content>
						<OpacityButton onPress={() => updateStatus({showModal2: true})}>
							<Content style={gstyle.linkCenter}>Secret Recovery Phase</Content>
						</OpacityButton>
					</Wrap>
					<OpacityButton onPress={() => updateStatus({showModal1: true})}>
						<Content style={{...gstyle.link, ...gstyle.textCenter, marginBottom: h(1)}} onPress={() => {navigation?.navigate('WebView', {url: "https://docs.neonwallet.io/guide/"})}}>Why is this important?</Content>
					</OpacityButton>
					<Wrap style={grid.panel}>
						<Content style={gstyle.textLightLgCenter}>MANUAL</Content>
						<Wrap style={{alignSelf: "stretch", display: "flex",}}>
							<Content style={gstyle.textLight}>Write down your Secret Recovery Phrase on a piece of paper and store in a safe place.</Content>
							<Wrap style={grid.gridMargin1}>
								<Content style={gstyle.label}><Content style={gstyle.bold}>Security level:</Content> Medium</Content>
								<ProgressBar progress={90} />
							</Wrap>
							<Wrap style={grid.gridMargin2}>
								<Content style={gstyle.labelWhite}>Risks are:</Content>
								<Content style={gstyle.labelWhite}>• You lose it</Content>
								<Content style={gstyle.labelWhite}>• You forget where you put it</Content>
								<Content style={gstyle.labelWhite}>• Someone else finds it</Content>
							</Wrap>
							<Content style={gstyle.textLight}>Other options: Doesn't have to be paper!</Content>
							<Wrap>
								<Content style={gstyle.labelWhite}>Tips:</Content>
								<Content style={gstyle.labelWhite}>• Store in bank vault</Content>
								<Content style={gstyle.labelWhite}>• Store in a safe</Content>
								<Content style={gstyle.labelWhite}>• Store in multiple secret places</Content>
								<Content style={gstyle.labelWhite}>• Start</Content>
							</Wrap>
						</Wrap>
					</Wrap>
				</Wrap>
				<Wrap style={grid.btnGroup}>
					<DefaultButton btnProps={{onPress: submit}}>Start</DefaultButton>
				</Wrap>
			</AuthLayout>
			{status.showModal1 && (
				<Wrap style={grid.modal}>
					<Wrap style={grid.modalContainer}>
						<Wrap>
							<OpacityButton style={grid.rowCenterEnd} onPress={closeModal1}>
								<Content style={{...gstyle.labelWhite, marginRight: w(1)}}>Close</Content>
								<Wrap style={{marginTop: h(2.2)}}>
									<Icon.X color={colors.danger} width={w(7)} height={w(7)} />
								</Wrap>
							</OpacityButton>
						</Wrap>
						<Wrap style={{marginBottom: h(5)}}>
							<Content style={gstyle.title}>Protect your wallet</Content>
							<Wrap style={{height: h(30), backgroundColor: colors.bgLight, marginBottom: h(3), display: "flex", justifyContent: "center", alignItems: "center"}}>
								<Content style={gstyle.labelWhite}>Illustration</Content>
								<Content style={gstyle.labelWhite}>Placeholder</Content>
							</Wrap>
							<Wrap style={grid.gridMargin2}>
								<Content style={gstyle.textLightCenter}>Don’t risk losing your funds. Protect your wallet by saving your Secret Recovery Phrase in a place you trust. <Content>It’s the only way to recover your wallet if you get locked out of the app or get a new device.</Content></Content>
							</Wrap>
							<Wrap style={{...grid.rowCenterCenter, ...grid.gridMargin2}}>
								<OpacityButton onPress={goNext}><Content style={gstyle.link} onPress={() => {navigation?.navigate('WebView', {url: "https://docs.neonwallet.io/guide/"})}}>Learn more</Content></OpacityButton>
							</Wrap>
						</Wrap>
					</Wrap>
				</Wrap>
			)}
			{status.showModal2 && (
				<Wrap style={grid.modal}>
					<Wrap style={grid.modalContainer}>
						<Wrap>
							<OpacityButton style={grid.rowCenterEnd} onPress={closeModal2}>
								<Content style={{...gstyle.labelWhite, marginRight: w(1)}}>Close</Content>
								<Wrap style={{marginTop: h(2.2)}}>
									<Icon.X color={colors.danger} width={w(7)} height={w(7)} />
								</Wrap>
							</OpacityButton>
						</Wrap>
						<Wrap style={{marginBottom: h(5)}}>
							<Content style={gstyle.title}>What is a “Secret recovery phrase”?</Content>
							<Wrap style={{paddingRight: w(5), paddingLeft: w(5)}}>
								<Content style={gstyle.textLightCenter}>A Secret Recovery Phrase is a set of twelve words that contains all the information about your wallet, including your funds. It's like a secret code used to access your entire wallet.</Content>
								<Content style={gstyle.textLightCenter}>You must keep your Secret Recovery Phrase secret and safe. If someone gets your Secret Recovery Phrase, they'll gain control over your accounts.</Content>
								<Content style={gstyle.textLightCenter}>Save it in a place where only you can access it. If you lose it, not even Meta Mask can help you recover it.</Content>
							</Wrap>
						</Wrap>
					</Wrap>
				</Wrap>
			)}
		</>
	);
}
