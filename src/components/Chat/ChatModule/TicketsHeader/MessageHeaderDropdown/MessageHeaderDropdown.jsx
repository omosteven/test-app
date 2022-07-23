import { ReactSVG } from "react-svg";
import imageLinks from "../../../../../assets/images";
import Dropdown from "../../../../../components/ui/Dropdown/Dropdown";

export const MessageHeaderDropdown = () => {
  return (
    <Dropdown
      size="sm"
      placeholder={
        <ReactSVG
          src={imageLinks?.svg?.horizontalEllipsis}
          className="d-inline-flex"
        />
      }
      anchor={false}
      changeValue={false}
      onChange={({ value }) => ""}
      options={[
        {
          value: "Item",
          label: "Item",
        },
        {
          value: "Item",
          label: "Item",
        },
        {
          value: "Item",
          label: "Item",
        },
      ]}
    />
  );
};

export default MessageHeaderDropdown;
