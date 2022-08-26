import React from "react"
import { QRCode } from 'react-native-custom-qr-codes-expo'

interface Props{
	code: string
	size?: number
}

const createQRCode = ({ code, size }:Props) => {
	return (
		<QRCode content={code} codeStyle='square' outerEyeStyle='square' innerEyeStyle='square' size={size || 100} color="white" backgroundColor="black" />	
	)
}

export default {
	createQRCode
}