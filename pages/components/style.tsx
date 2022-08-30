import {  StyleSheet } from "react-native"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import * as Font from "expo-font"

export const w = (w: number) => wp(w + '%')
export const h = (h: number) => hp(h + '%')

export const colors = {
	bgSecondary: "rgba(0,0,0, 0.9)",
	bgButton: "#9f834f",
	bgOpacity: "rgba(0, 0, 0, 0.505)",
	bgLight: "rgba(0, 0, 0, 0.6)",
	bgModal: "rgba(0,0,0, 0.9)",
	bg: "rgba(0, 0, 0, 0.605)",
	bgDisable: "#7f734f",
	warning: "#B7E02D",
	danger: "#c2076c",
	black: "black",
	white: "#ffffff",
	color: "#a0844f",
	colorDisable: "#333",

	border: "rgba(255, 255, 255, 0.2)",
	shadow: "#e6a54b",
	placeholder: "#666"
}

export const textColor = {
	white: { color: colors.white },
	primary: { color: colors.bgButton },
	warning: { color: colors.warning },
	danger: { color: colors.danger }
}



const getFontFamily =  () => {
	const loaded = Font.isLoaded("Chakra");
	return {
			t1: { fontSize: hp('5%'), fontFamily: loaded ? "Chakra": ""}, 
			t2: { fontSize: hp('4%'), fontFamily: loaded ? "Chakra": ""},
			t3: { fontSize: hp('3%'), fontFamily: loaded ? "Chakra": ""},
			t: 	{ fontSize: hp('2.2%'), fontFamily: loaded ? "Chakra": ""},
			t0: { fontSize: hp('1.5%'), fontFamily: loaded ? "Chakra": ""}
		}
}


export const gfont = getFontFamily()

export const grid = StyleSheet.create({
	gridMargin1: {
		marginBottom: h(1)
	},
	gridMargin2: {
		marginBottom: h(2)
	},
	gridMargin3: {
		marginBottom: h(3)
	},
	gridMargin4: {
		marginBottom: h(4)
	},
	colBetween: {
		alignSelf: "stretch",
		flex: 1,
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-around"
	},
	rowCenter: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
	},
	rowCenterCenter: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center"
	},
	rowCenterAround: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-around"
	},
	rowBetween: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
	},
	rowCenterBetween: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		alignContent:'center',
		justifyContent: "space-between"
	},
	rowCenterEnd: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-end"
	},
	btnGroup: {
		alignSelf: "stretch",
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginLeft: w(-2),
		marginRight: w(-2)
	},
	panel: {
		backgroundColor: colors.bgLight,
		paddingTop: h(3),
		paddingBottom: h(3),
		paddingLeft: w(5),
		paddingRight: w(5),
		marginBottom: h(5),
		borderTopRightRadius: w(2),
		borderBottomLeftRadius: w(2)
	},
	modal: {
		// position: "absolute",
		// top: 0,
		// left: 0,
		marginTop: h(-100),
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: colors.bgLight,
		borderRadius: w(2),
		width: w(100),
		minHeight: h(100),
		zIndex: 1
	},
	modalContainer: {
		alignSelf: "center",
		backgroundColor: colors.bgModal,
		paddingTop: h(1),
		paddingBottom: h(3),
		width: w(90),
		maxHeight: h(85),
		borderColor: colors.color,
		borderRadius: w(2),
		borderWidth:w(0.08)
	},
	modalContent: {
		paddingTop: h(2),
		paddingRight: w(5),
		paddingLeft: w(5),
		paddingBottom: h(2)
	},
	dropdown: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: colors.bgLight,
		width: w(70),
		borderColor: colors.bgButton,
		borderWidth: w(0.2),
		height: h(7),
		paddingLeft: w(5),
		paddingRight: w(5)
	}
})

export const gstyle = StyleSheet.create({
	body: {
		minHeight: h(100),
		minWidth: w(100)
	},
	container: {
		flex: 1,
		paddingTop: h(1),
		paddingBottom: h(5)
	},
	scrollviewContainer: {
		paddingBottom: h(3)
	},
	subContainer: {
		paddingRight: w(5),
		paddingLeft: w(5)
	},
	title: {
		marginTop: h(4),
		color: colors.color,
		fontWeight: "700",
		textTransform: "uppercase",
		textAlign: "center",
		marginBottom: h(3.5),
		...gfont.t3
	},
	titleEff: {
		...grid.rowCenter,
		borderBottomWidth: w(0.2),
		borderColor: colors.color,
		paddingBottom: h(1),
		marginLeft: w(5),
		marginRight: w(3),
		marginBottom: h(3.5)
	},
	title2: {
		...gfont.t2,
		color: colors.color,
		fontWeight: "700",
		textTransform: "uppercase",
		textAlign: "center"
	},
	label: {

		...gfont.t,
		color: colors.white,
		marginBottom: h(1)
	},
	labelWhite: {
		...gfont.t,
		...textColor.white
	},
	labelSm: {
		...gfont.t0,
		...textColor.white,
		lineHeight: h(2)
	},
	labelLg: {
		...gfont.t3,
		...textColor.white,
		lineHeight: h(2.8)
	},
	textLight: {
		...gfont.t,
		...textColor.white,
		lineHeight: h(2.8),
		marginBottom: h(2)
	},
	bold: {
		fontWeight: "700"
	},
	textLightCenter: {
		...gfont.t,
		...textColor.white,
		marginBottom: h(2),
		textAlign: "center"
	},
	textLightSm: {
		...gfont.t0,
		...textColor.white,
		lineHeight: h(2.8),
		marginBottom: h(2)
	},
	textLightLg: {
		...gfont.t3,
		...textColor.white,
		lineHeight: h(2.8),
		marginBottom: h(2)
	},
	textLightLgCenter: {
		...gfont.t3,
		...textColor.white,
		lineHeight: h(2.8),
		marginBottom: h(2),
		textAlign: "center"
	},
	textLightMd: {
		...gfont.t3,
		...textColor.white,
		lineHeight: h(2.8),
		marginBottom: h(2)
	},
	textLightMdCenter: {
		...gfont.t3,
		...textColor.white,
		lineHeight: h(2.8),
		marginBottom: h(2),
		textAlign: "center"
	},
	textLightSmCenter: {
		...gfont.t0,
		...textColor.white,
		marginBottom: h(2),
		textAlign: "center"
	},
	textLightCenterUppercase: {
		...gfont.t,
		...textColor.white,
		marginBottom: h(2),
		textAlign: "center"
	},
	textWarning: {
		...gfont.t,
		...textColor.warning,
		lineHeight: h(2.8),
		marginBottom: h(2)
	},
	textDanger: {
		...gfont.t,
		...textColor.danger,
		lineHeight: h(2.8),
		marginBottom: h(2)
	},
	link: {
		...gfont.t,
		color: colors.color,
	},
	linkCenter: {
		...gfont.t,
		color: colors.color,
		marginBottom: h(2),
		textAlign: "center"
	},
	textCenter: {
		alignSelf: "center",
		textAlign: "center",
	},
	bg1: {
		backgroundColor: colors.bgButton,
	},
	bg2: {
		backgroundColor: colors.warning,
	},
	bg3: {
		backgroundColor: colors.danger,
	},
	listItem: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-start"
	},
	hr: {
		backgroundColor: colors.border,
		height: h(0.1),
		width: w(90),
		marginTop: h(2),
		marginBottom: h(2),
		alignSelf: "center"
	},
	hr2: {
		backgroundColor: colors.border,
		height: h(0.1),
		marginTop: h(2),
		marginBottom: h(2),
		alignSelf: "stretch"
	},
	input: {
		...gfont.t,
		alignSelf: "center",
		color: colors.color,
		borderColor: colors.border,
		borderWidth: 1,
		paddingTop: h(2),
		paddingBottom: h(2),
		paddingRight: w(3),
		paddingLeft: w(3),
	}
})