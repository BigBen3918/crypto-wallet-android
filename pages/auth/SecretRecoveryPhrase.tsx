import React from "react"
import { Content, OpacityButton, Wrap } from "../components/commons";
import AuthLayout from "../layouts/AuthLayout";

interface SecretPhraseStatus{
	showModal:	boolean
}

export default function ({ navigation }: any) {
	const [status, setStatus] = React.useState<SecretPhraseStatus>({
		showModal:	true
	})

	const closeModal = () => {
		setStatus({
			showModal: false
		})
	}

	const submit = () => { 
		navigation?.navigate('ConfirmPass')
	}

	return (
		<>
			<AuthLayout>
				<Wrap>
					<Wrap>
					</Wrap>
					<Wrap>
						<Wrap>
							<OpacityButton onPress={submit}><Content>Start</Content></OpacityButton>
						</Wrap>
					</Wrap>
				</Wrap>
			</AuthLayout>
			{status.showModal && (
				<Wrap>
					<Wrap>
						<Wrap>
							<OpacityButton onPress={closeModal}><Content>Close</Content></OpacityButton>
						</Wrap>
						<Wrap>
							<Content>What is a “Secret recovery phrase”?</Content>
							<Wrap>
								<Content>A Secret Recovery Phrase is a set of twelve words that contains all the information about your wallet, including your funds. It's like a secret code used to access your entire wallet.</Content>
								<Content>You must keep your Secret Recovery Phrase secret and safe. If someone gets your Secret Recovery Phrase, they'll gain control over your accounts.</Content>
								<Content>Save it in a place where only you can access it. If you lose it, not even Meta Mask can help you recover it.</Content>
							</Wrap>
						</Wrap>
					</Wrap>
				</Wrap>
			)}
		</>
	);
}
