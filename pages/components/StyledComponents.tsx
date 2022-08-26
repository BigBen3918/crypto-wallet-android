import { StyleSheet } from "react-native"
import { colors, gfont, grid,  h, w } from "./style"

export const authLayout = StyleSheet.create({
	header: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		alignContent: 'center',
		height: h(10),
		paddingLeft: w(3),
		paddingRight: w(3),
	},
	prev_btn: {
	},
	prev_icon: {
		color: colors.warning
	},
	container: {
		flex: 1,
		paddingTop: h(1),
		paddingBottom: h(5),
		paddingRight: w(7),
		paddingLeft: w(7)
	},
	footer: {
		paddingLeft: w(5),
		paddingRight: w(5),
		alignSelf: "stretch",
		textAlign: "center"
	}
})

export const getStarted = StyleSheet.create({
	carosel: {
		marginBottom: h(8),
		textAlign: "center"
	},
	imageWrapper: {
		...grid.rowCenterCenter
	}
})

export const walletSetup = StyleSheet.create({
	content: {
		paddingTop: h(15)
	}
})

export const importFromSeed = StyleSheet.create({
	rememberMe: {
		...grid.rowCenterBetween,
		marginBottom: h(7)
	}
})

export const createPass = StyleSheet.create({
	checkBox: {
		...grid.rowCenter,
		marginBottom: h(3)
	}
})

export const stepper = StyleSheet.create({
	wrapper: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "flex-start",
		marginTop: h(1),
		marginBottom: h(-3)
	},
	step: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
	},
	stepBox: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		width: w(5),
		height: w(5),
		backgroundColor: colors.bgLight,
		borderRadius: w(1),
		borderWidth: w(0.3),
		borderColor: colors.bgButton,
		transform: [{ rotate: '45deg'}],
		marginBottom: h(1)
	},
	label: {
		...gfont.t0,
		color: colors.color,
		textAlign: "center"
	},
	stepContent: {
		...gfont.t0,
		color: colors.color,
		transform: [{ rotate: '-45deg'}]
	},
	line: {
		marginTop: h(1.25),
		height: h(0.2),
	}
})

export const secretPhrase = StyleSheet.create({
	word: {
		...grid.rowCenter,
		flex: 1,
		marginBottom: h(1.5),
		height: h(4),
		paddingLeft: w(5),
		paddingRight: w(5),
		marginLeft: w(3),
		marginRight: w(3),
		borderWidth: w(0.2),
		borderRadius: w(2),
		borderColor: colors.placeholder,
		borderStyle: "solid"
	}
})

export const confirmPhrase = StyleSheet.create({
})

export const walletLayout = StyleSheet.create({
	header: {
		...grid.rowCenterBetween,
		height: h(10),
		paddingLeft: w(3),
		paddingRight: w(3),
	},
	container: {
		position: "absolute",
		top: 0,
		left: w(0),
		display: "flex",
		width: w(100),
		height: h(100),
		backgroundColor: colors.bgOpacity
	},
	key: {
		paddingLeft: w(3),
		paddingRight: w(3),
		paddingTop: h(0.5),
		paddingBottom: h(0.5),
		borderColor: colors.bgLight,	
		borderWidth: w(0.3),
		borderRadius: w(2),
		marginBottom: h(3)
	},
	btn: {
		...grid.rowCenterCenter,
		backgroundColor: colors.bgModal,
		paddingLeft: w(4),
		paddingRight: w(4),
		height: h(5),
		borderTopLeftRadius: w(2),
		borderBottomRightRadius: w(2),
	},
	menu: {
		alignSelf: "stretch",
		paddingTop: h(2),
		paddingBottom: h(2)
	},
	item: {
		alignSelf: "stretch",
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		paddingLeft: w(5)
	},
	itemContent: {
		paddingTop: h(1),
		paddingBottom: h(1),
		textTransform: "uppercase",
		...gfont.t,
	}
})

export const walletTokens = StyleSheet.create({
	key: {
		paddingLeft: w(3),
		paddingRight: w(3),
		paddingTop: h(0.5),
		paddingBottom: h(0.5),
		borderColor: colors.bgLight,
		borderWidth: w(0.3),
		borderRadius: w(2),
		marginBottom: h(3)
	},
	tokenItem: {
		borderBottomWidth: h(0.1),
		borderColor: colors.border,
		paddingRight: w(5),
		paddingLeft: w(5),
		paddingTop: h(3),
		paddingBottom: h(3)
	},
	btnWrapper: {
		...grid.rowCenterAround,
		alignSelf: "center",
		alignItems: "center",
		width: w(80),
		marginBottom: h(2)
	}
})

export const functionLayout = StyleSheet.create({
	header: {
		...grid.rowCenterBetween,
		paddingLeft: w(5),
		paddingRight: w(5),
		paddingTop: h(2),
		paddingBottom: h(3),
		// backgroundColor: colors.bgSecondary,
		marginBottom: h(1)
	},
	content: {
		...grid.rowCenterCenter
	},
	network: {
		...grid.rowCenterCenter,
		backgroundColor: colors.bgLight,
		height: w(9),
		paddingLeft: w(3),
		paddingRight: w(1),
		marginRight: w(3)
	},
	footer: {
		paddingLeft: w(5),
		paddingRight: w(5),
		alignSelf: "stretch",
		textAlign: "center"
	}
})

export const setting = StyleSheet.create({
	header: {
		...grid.rowCenter,
		height: h(12),
		paddingLeft: w(3)
	},
	arrowLeft: {
		marginRight: w(5)
	},
	item: {
		paddingTop: h(2),
		paddingBottom: h(2),
		paddingLeft: w(5),
		paddingRight: w(5),
		borderColor: colors.border,
		borderWidth: w(0.2)
	}
})