import React from "react"
import Jazzicon from 'react-native-jazzicon'
import { w } from "./style"
import {Picture} from "./commons"
import { toDataUrl } from "./blockies"
import { ZeroAddress } from "../../library/wallet"

interface AvatarProps {
	size?: number
	address?: string
	type: "Zazzicon" | "Blockies"
}


export default function ({size, address, type = "Zazzicon"}: AvatarProps) {
	return <>
		{
			type === "Zazzicon" &&  <Jazzicon size={w(size || 16)} address={address}/>
		}
		{
			type === "Blockies" && <Picture source={{ uri: toDataUrl(address || ZeroAddress) }} style={{width: w(size || 20), height: w(size || 20), borderRadius: w(20)}}/> 
		}
	</>
}