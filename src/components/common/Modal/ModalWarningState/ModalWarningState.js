import React from "react";
import WarningStateIcon from "../../../assets/svg/warning-state-icon.svg";
import FormGroupTextbox from "../../FormGroup/FormGroupTextbox/FormGroupTextbox";

const ModalWarningState = ({
	text,
	withReason,
	buttonText,
	withReasonInputProps,
	onClick,
	onCancel,
}) => {
	return (
		<div className="px-5 text-center">
			<img
				src={WarningStateIcon}
				alt=""
				height="100px"
				className="mt-5 mb-4"
			/>

			<p className="mb-5 text-black font-20">{text}</p>

			{withReason && (
				<div className="text-left mb-4">
					<FormGroupTextbox {...withReasonInputProps} />
				</div>
			)}

			<div className="d-flex">
				{onCancel && (
					<button
						type="button"
						className="btn btn--secondary btn--lg btn--bordered mr-4"
						onClick={onCancel}
					>
						No, Cancel
					</button>
				)}

				<button
					type="button"
					className="btn btn--primary btn--lg"
					onClick={onClick}
				>
					{buttonText}
				</button>
			</div>
		</div>
	);
};

export default ModalWarningState;
