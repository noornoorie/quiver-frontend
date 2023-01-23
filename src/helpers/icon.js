import { icons } from "feather-icons";

export const getIcon = (name) => {
    return icons[name] ? icons[name].toSvg() : null;
};
