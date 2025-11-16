
import { TechCategory } from "./TechCategory";

interface TechStackProps {
  title: string;
  items: string[];
}

const TechStack = ({ title, items }: TechStackProps) => {
  return (
    <TechCategory title={title} items={items} />
  );
};

export default TechStack;
