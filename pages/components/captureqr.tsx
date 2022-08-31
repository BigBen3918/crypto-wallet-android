import React from 'react'
import { BarCodeScanner } from 'expo-barcode-scanner';
import { w, h, colors} from "./style"
import useStore from '../../useStore'
	
interface props {
	onScanned: Function
}

export default function ({onScanned}:props) {
	const {showToast} = useStore()
	React.useEffect(() => {
		(async () => {
			const { status } = await BarCodeScanner.requestPermissionsAsync();
			if(status !== 'granted') {
				showToast("Camera permission error", "Could not found camera or has not permission")
				
			}
			await BarCodeScanner.usePermissions()
		})();
	}, []);
	return (
		<BarCodeScanner
			onTouchEndCapture={(e:any)=>{alert(e)}}	onBarCodeScanned={(data: any) => {onScanned(data)}} style={{width:w(100), height:h(100), position:'absolute', backgroundColor:colors.black, top:0, left:0}} 
		/>
	)
}