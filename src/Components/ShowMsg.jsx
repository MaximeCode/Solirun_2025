import { OctagonX } from "lucide-react";
import PropTypes from "prop-types";

export default function ShowMsg({ msg }) {
  return msg.allowed ? (
    msg.msg
  ) : (
    <span className="italic text-gray-400 flex items-center">
      <OctagonX
        size={14}
        className="mr-2"
      />{" "}
      Message supprimé par {msg.moderateurName}
    </span>
  );
}

ShowMsg.propTypes = {
  msg: PropTypes.shape({
    allowed: PropTypes.bool.isRequired,
    msg: PropTypes.node,
    moderateurName: PropTypes.string,
  }).isRequired,
};
