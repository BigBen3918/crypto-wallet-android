import React from "react"
import Icon from "../components/Icon"
import { Modal } from "../components/elements"
import { Content, Wrap } from "../components/commons"
import { colors, grid, gstyle, w } from "../components/style"

interface CopiedModalProps {
	close: any
}

export default function ({close}:CopiedModalProps) {
	React.useEffect(() => {
		setTimeout(close, 1000)
	}, [])

	return (
		<Modal
			close={close}
			width={70}
			hideCloseButton
		>
			<Wrap style={{...grid.rowCenterCenter, marginLeft: w(4)}}>
				<Wrap style={{}}><Icon.Check color={colors.bgButton} width={50} height={50} /></Wrap>
			</Wrap>
			<Content style={{...gstyle.textLightCenter, textTransform: "uppercase"}}>Public address copied to clipboard</Content>
		</Modal>
	)
}