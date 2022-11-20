import Button from "./Button";
import { ArrowPathIcon } from "@heroicons/react/24/solid";

export default {
  title: "Button",
  component: Button,
};

export const Default = () => <Button>Submit</Button>;

export const Disabled = () => <Button disabled>Submit</Button>;

export const Icon = () => (
  <Button icon={<ArrowPathIcon className="h-5 w-5" />}>Refresh</Button>
);

export const DisabledWithIcon = () => (
  <Button disabled icon={<ArrowPathIcon className="h-5 w-5" />}>
    Refresh
  </Button>
);
