import { faker } from "@faker-js/faker";
import BodyText from "./BodyText";

export default {
  title: "common/BodyText",
  component: BodyText,
};

export const Default = () => <BodyText>{faker.lorem.sentences(4)}</BodyText>;
