import SecondaryButton from "../../../components/buttons/SecondaryButton";

export default function DownloadButton({ ...props }) {
    return (
        <SecondaryButton
            label={"Export"}
            onNotify={props.handleDownloadPdf}
            iconLeft={"downloadImg"}
            disabled={props?.load}
        />
    );
}
