import React from "react"
import { Image, ImageBackground, ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

type WrapProps = View["props"] & {
	children?:	React.ReactNode;
}
export const Wrap = (props: WrapProps) => {
	return <View {...props} />
}

type ScrollWrapProps = ScrollView["props"] & {
	children?:	React.ReactNode;
}
export const ScrollWrap = (props: ScrollWrapProps) => {
	return <ScrollView {...props} />
}

type ContentProps = Text["props"] & {
	children?:	React.ReactNode;
}
export const Content = (props: ContentProps) => {
	return <Text {...props} />
}
export const Spinner = () => {
	return <ActivityIndicator size="large" color="#eeeeee" />
}

type OpacityButtonProps = TouchableOpacity["props"] & {
	children?:	React.ReactNode;
}
export const OpacityButton = (props: OpacityButtonProps) => {
	return <TouchableOpacity {...props} />
}

type ButtonWithoutFeedbackProps = TouchableWithoutFeedback["props"] & {
	children?:	React.ReactNode;
}
export const ButtonWithoutFeedback = (props: ButtonWithoutFeedbackProps) => {
	return <TouchableWithoutFeedback {...props} />
}

type PictureProps = Image["props"] & {
	children?:	React.ReactNode;
}
export const Picture = (props: PictureProps) => {
	return <Image {...props} />
}

type SvgProps = {
	children?:	React.ReactNode;
}
export const Svg = (props: SvgProps) => {
	return <Svg {...props} />
}

type InputProps = TextInput["props"] & {
	children?:	React.ReactNode;
}
export const Input = (props: InputProps) => {
	return <TextInput {...props} />
}

type ImageBackgroundProps = ImageBackground["props"] & {
	children?:	React.ReactNode;
}
export const BgImage = (props: ImageBackgroundProps) => {
	return <ImageBackground {...props} />
}