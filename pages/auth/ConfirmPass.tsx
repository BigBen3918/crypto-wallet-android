import React from "react";
import AuthLayout from "../layouts/AuthLayout";
import { Content,  Wrap } from "../components/commons";
import { colors, grid, gstyle } from "../components/style";
import { DefaultButton, DefaultInput, Stepper } from "../components/elements";
import useStore, { hmac } from "../../useStore";

export default function ({ route, navigation }: any) {
	const {password} = route.params;
	const {showToast} = useStore()
		
	const [status, setStatus] = React.useState({
		confirmPass: ""
	})
		
	const updateStatus = (params:{[key:string]:string|number|boolean}) => setStatus({...status, ...params});

	const goBack = () => { 
		navigation?.goBack()
	}

	const submit = async () => { 
		const p2 = await hmac(status.confirmPass)
		if(p2 !== password) {
			return showToast("Invalid confirm password")
		}
		navigation?.navigate('SecretPhrase', {password})
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
					step={1} 
				/>
			}
			title="Confirm your password"
		>
			<Content style={gstyle.textLightCenter}>Before continuing we need you to confirm your password</Content>
			<Wrap>
				<Wrap>
					<DefaultInput
						inputProps={{
							secureTextEntry: true,
							textContentType: "password",
							placeholderTextColor: colors.placeholder,
							placeholder: "New password",
							onChangeText: (txt:string) => updateStatus({confirmPass: txt})
						}} 
						visibleValue={true}
					/>
				</Wrap>
				<Wrap style={grid.btnGroup}>
					<DefaultButton btnProps={{onPress: submit}}><Content>Confirm</Content></DefaultButton>
				</Wrap>
			</Wrap>
		</AuthLayout>
	);
}
