import React from "react"
import { Content, Wrap } from "../components/commons";
import { DefaultButton } from "../components/elements";
import { colors, grid, gstyle, h, w } from "../components/style";
import Icon from "../components/Icon";
import AuthLayout from "../layouts/AuthLayout";

export default function ({ navigation }: any) {
	const goBack = () => { 
		navigation?.goBack()
	}

	const submit = () => { 
		navigation?.navigate('Import')
	}

	return (
		<AuthLayout
			title="Help us improve ICICBWallet"
			onBack={goBack}
			footer={(
				<>
					<Wrap style={gstyle.hr} />
					<Wrap style={grid.btnGroup}>
						<DefaultButton btnProps={{onPress: submit}}>No Thanks</DefaultButton>
						<DefaultButton theme="warning" btnProps={{onPress: submit}}>I Agree</DefaultButton>
					</Wrap>
				</>
			)}
		>
			<Wrap>
				<Content style={gstyle.textLight}>ICICB Wallet would like to gather basic usage data to better understand how our users interact with the mobile app. This data will be used to continually improve the usability and user experience of our product.</Content>
				<Content style={gstyle.textLight}>ICICB Wallet will...</Content>
				<Wrap>
					<Wrap style={gstyle.listItem}>
						<Wrap style={{marginTop: h(-1.5)}}>
							<Icon.Check color={colors.warning} width={w(5)} height={w(5)} />
						</Wrap>
						<Content style={gstyle.textLight}>Always allow you to opt-out via Settings</Content>
					</Wrap>
					<Wrap style={gstyle.listItem}>
						<Wrap style={{marginTop: h(-1.5)}}>
							<Icon.Check color={colors.warning} width={w(5)} height={w(5)} />
						</Wrap>
						<Content style={gstyle.textLight}>Send anonymized click &amp; pageview events</Content>
					</Wrap>
					<Wrap style={gstyle.listItem}>
						<Wrap style={{marginTop: h(-1.5)}}>
							<Icon.Check color={colors.warning} width={w(5)} height={w(5)} />
						</Wrap>
						<Content style={gstyle.textLight}>Send country, region, city data (not specific location)</Content>
					</Wrap>
					<Wrap style={gstyle.listItem}>
						<Wrap style={{marginTop: h(-0.5)}}>
							<Icon.X color={colors.danger} width={w(5)} height={w(5)} />
						</Wrap>
						<Content style={gstyle.textLight}>Never collect keys, addresses, transactions, balances, hashes, or any personal information</Content>
					</Wrap>
					<Wrap style={gstyle.listItem}>
						<Wrap style={{marginTop: h(-0.5)}}>
							<Icon.X color={colors.danger} width={w(5)} height={w(5)} />
						</Wrap>
						<Content style={gstyle.textLight}>Never collect your IP address</Content>
					</Wrap>
					<Wrap style={gstyle.listItem}>
						<Wrap style={{marginTop: h(-0.5)}}>
							<Icon.X color={colors.danger} width={w(5)} height={w(5)} />
						</Wrap>
						<Content style={gstyle.textLight}>Never sell data for profit. Ever!</Content>
					</Wrap>
				</Wrap>
				<Wrap style={gstyle.hr} />
				<Content style={gstyle.textLight}>This data is aggregated and is therefore anonymous for the purposes of General Data Protection Regulation (EU) 2016/679. For more information in relation to our privacy practices, please see our <Content style={gstyle.link} onPress={() => {navigation?.navigate('WebView', {url: "https://docs.ICICBWallet.io/guide/"})}}>Privacy Policy</Content> here. </Content>
			</Wrap>
		</AuthLayout>
	);
}
