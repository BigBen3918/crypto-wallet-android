import React from "react"
import {TextInputProps, StyleSheet,  TouchableOpacityProps } from "react-native"
import { stepper } from "./StyledComponents"
import Icon from "./Icon"
import { colors, gfont, grid, gstyle, h, w } from "./style"
import { BgImage, ButtonWithoutFeedback, Content, Input, OpacityButton, ScrollWrap, Spinner, Wrap } from "./commons"


export const DefaultInput = ({ label, inputProps, visibleValue, children, warning}
	: { label?: string | JSX.Element, inputProps?: TextInputProps, visibleValue: boolean, children?: any, warning?: any }
) => {
	const [status, setStatus] = React.useState({
		showValue: true
	})
	const style = inputProps && inputProps.style || {}
	let st2 = {
		...gfont.t,
		flex: 1,
		color: colors.color,
		height: h(8),
		borderColor: colors.placeholder,
		borderWidth: 1,
		paddingTop: h(2),
		paddingBottom: h(2),
		paddingRight: w(3),
		paddingLeft: w(3),
		backgroundColor: "rgba(150, 54, 245, 0.2)",
	};
	Object.assign(st2, style)

	return (
		<Wrap style={{
			display: "flex",
			justifyContent: "center",
			marginBottom: h(4),
		}}>
			<Wrap style={grid.rowCenterBetween}>
				<Content style={gstyle.label}>{label}</Content>
				{visibleValue && (
					<OpacityButton onPress={() => setStatus({showValue: !status.showValue})}>
						<Content style={gstyle.link}>{status.showValue ? "Show" : "Hide"}</Content>
					</OpacityButton>
				)}
			</Wrap>
			<Input 
				placeholderTextColor={colors.placeholder}
				{...inputProps}
				secureTextEntry={visibleValue && status.showValue}
				style={st2}
			/>
			{ children }
			{warning && (
				<Wrap style={{
					marginTop: h(1)
				}}>{warning}</Wrap>
			)}
		</Wrap>
	)
}

export const ImageInput = ({ icon, inputProps, iconProps }
	: { icon: any, inputProps?: TextInputProps, iconProps?: any }
) => {
	return (
		<Wrap
			style={{
				...grid.rowCenterCenter,
				...grid.gridMargin2,
				backgroundColor: colors.bgLight
			}}
		>
			<Wrap
				style={{
					paddingLeft: w(3),
					paddingRight: w(3)
				}}
			>
				{icon}
			</Wrap>
			<Input
				style={{
					...gfont.t,
					flex: 1,
					color: colors.color,
					height: h(8)
				}}
				placeholderTextColor={colors.placeholder}
				{...inputProps}
			/>
		</Wrap>
	)
}

export const DefaultButton = ({ btnProps, children, block, width, height, hideMargin, theme }
	: { btnProps?: TouchableOpacityProps, children: any, block?: boolean, width?: number, height?: number, hideMargin?: boolean, theme?: "init" | "warning" | "danger" }
) => {
	theme = theme ? theme : "init"
	const themeColors = {
		init: {
			origin: colors.bgButton,
			disabled: colors.bgDisable,
			color: colors.color,
			colorDisabled: colors.colorDisable
		},
		warning: {
			origin: colors.warning,
			disabled: colors.bgDisable,
			color: colors.bgButton,
			colorDisabled: colors.colorDisable
		},
		danger: {
			origin: colors.danger,
			disabled: colors.bgDisable,
			color: colors.color,
			colorDisabled: colors.colorDisable
		}
	}

	return (
		<Wrap style={{
			flex: 1,
			maxWidth: block ? w(90) : (width ? w(width) : w(60)),
			height: height ? h(height) : h(8),
			paddingLeft: w(2),
			paddingRight: w(2),
			marginBottom: !hideMargin ? h(2): 0,
		}}>
			<OpacityButton
				style={{
					...grid.rowCenterBetween,
					flex: 1,
					paddingLeft: w(1),
					paddingRight: w(1),
					paddingTop: h(1),
					paddingBottom: h(1),
					backgroundColor: !btnProps?.disabled ? themeColors[theme].origin : themeColors[theme].disabled,
				}}
				{...btnProps}
			>
				{!btnProps?.disabled && (
					<Wrap style={{ alignSelf: "stretch", width: w(1), backgroundColor: colors.bgLight }} />
				)}
				<Content style={{
					...gfont.t,
					flex: 1,
					color: !btnProps?.disabled ? themeColors[theme].color : themeColors[theme].origin,
					textAlign: "center"
				}}>
					{children}
				</Content>
				{!btnProps?.disabled && (
					<Wrap style={{ alignSelf: "stretch", width: w(1), backgroundColor: colors.bgLight }} />
				)}
			</OpacityButton>
		</Wrap>
	)
}

export const FunctionalButton = ({ label, children, btnProps }
	:{ label: string, children: any, btnProps?: TouchableOpacityProps }
) => {
	return (
		<Wrap style={{
			opacity: btnProps?.disabled ? 0.3 : 1
		}}>
			<OpacityButton 
				style={{
					...grid.rowCenterCenter,
					width: w(15),
					height: h(8),
					backgroundColor: colors.bgLight,
					marginBottom: h(1),
					borderTopLeftRadius: w(2),
					borderBottomRightRadius: w(2),
				}}
				{...btnProps}
			>
				{children}
			</OpacityButton>
			<Content style={gstyle.textLightCenter}>{label}</Content>
		</Wrap>
	)
}

export const Stepper = ({data, step}
	:{data: Array<{label: string}>, step: number}
) => {
	const len = data.length
	return (
		<Wrap style={stepper.wrapper}>
			{data.map((i:{label: string}, k:number) => (
				<React.Fragment key={k}>
					{k !== 0 && (
						<Wrap 
							style={{
								...stepper.line, 
								width: w(85 * 2 * 0.388 / len),
								marginLeft: w(-85 * 0.388 / len),
								marginRight: w(-85 * 0.388 / len),
								backgroundColor: (k <= step) ? colors.warning : colors.placeholder
							}}
						/>
					)}
					<Wrap 
						style={{
							...stepper.step, 
							width: w(85 / len)
						}}
					>
						<Wrap 
							style={{
								...stepper.stepBox,
								borderColor: (k <= step) ? colors.warning : colors.bgButton,
								backgroundColor: (k < step) ? colors.warning : colors.bgLight
							}}
						>
							<Content 
								style={{
									...stepper.stepContent,
									color: (k < step) ? colors.bgButton : ((k >= step ? colors.color : colors.placeholder))
								}}
							>
								{k + 1}
							</Content>
						</Wrap>
						<Content style={{
							...stepper.label,
							color: (k <= step) ? colors.warning : colors.color,
						}}>
							{i.label}
						</Content>
					</Wrap>
				</React.Fragment>
			))}
		</Wrap>
	)
}

export const ProgressBar = ({progress}
	:{progress: number}
) => {
	return (
		<Wrap
				style={{
					height: h(1.2),
					overflow: "hidden",
					transform: [{ rotateY: "-45deg" }, { rotateX: "45deg" }, {scaleX: 1.37}, {translateX: w(-4)}]
				}}
			>
				<BgImage 
					source={require("../../assets/bg-progress.png")} 				
					resizeMode="stretch" 
					style={{
						...grid.rowCenter,
						width: "auto",
						flex: 1,
						alignSelf: "stretch",
						marginLeft: w(-2),
						marginRight: w(-2)
					}}
				>
					<Wrap
						style={{
							flex: progress,
							height: h(1.2),
							backgroundColor: "transparent"
						}}
					/>
					<Wrap
						style={{
							flex: 100 - progress,
							height: h(1.2),
							backgroundColor: colors.bgSecondary
						}}
					/>
				</BgImage>
			</Wrap>
	)
}

export const Modal = ({close, children, width, title, hideCloseButton, footer}
	:{close: any, children: any, width?: number, title?: string | any, hideCloseButton?: boolean, footer?:any}
) => {
	return (
		<ButtonWithoutFeedback onPress={close}>
				<Wrap style={grid.modal}>
					<ButtonWithoutFeedback onPress={() => {}}>
						<Wrap style={{
							...grid.modalContainer,
							alignSelf: "center",
							width: w(width ? width : 90),
						}}>
							{!hideCloseButton && (
								<Wrap style={grid.rowCenterEnd}>
									<OpacityButton style={grid.rowCenterBetween} onPress={close}>
										<Content style={{...gstyle.label, marginRight: w(1)}}>CLOSE</Content>
										<Wrap style={{marginTop: h(1.1)}}>
											<Icon.X width={w(7)} height={w(7)} color={colors.danger} />
										</Wrap>
									</OpacityButton>
								</Wrap>
							)}
							{title && (
								<Wrap >
									<Content style={{...gstyle.title, marginTop: h(1), marginBottom: h(1.5)}}>{title}</Content>
								</Wrap>
							)}
							<ScrollWrap contentContainerStyle={grid.modalContent}>
								{children}
							</ScrollWrap>
							{footer && (
								<Wrap style={{paddingTop: h(2)}}>
									{footer}
								</Wrap>
							)}
						</Wrap>
					</ButtonWithoutFeedback>
				</Wrap>
			{/* </Animated.View> */}
		</ButtonWithoutFeedback>
	)
}

export const DropdownButton = ({dropdown, children}
	:{dropdown: any, children: any}
) => {
	return (
		<OpacityButton style={grid.dropdown} onPress={() => dropdown(true)}>
			<Content style={{...gstyle.labelWhite, marginRight: w(2)}}>{children}</Content>
			<Wrap style={{paddingTop: w(1)}}><Icon.ArrowBottom /></Wrap>
		</OpacityButton>
	)
}

export const Loading = () => {
	const styles = StyleSheet.create({
		container: {
			flex: 1,
			justifyContent: "center"
		}
	});
  
	return (
		<Wrap style={grid.modal}>
			<Wrap style={[styles.container]}>
				<Wrap style={{padding:w(10),  backgroundColor:'rgba(0,0,0,0.85)', borderRadius:w(2)}}>
					<Spinner />
					<Content style={{...gstyle.labelWhite, marginTop:h(2)}}>Please wait</Content>
				</Wrap>
			</Wrap>
		</Wrap>
	)
}