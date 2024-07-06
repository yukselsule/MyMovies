import { useLists } from "../contexts/ListsContext.jsx";
import ListBox from "./ListBox.jsx";

function Lists() {
  const { listNames } = useLists();

  return (
    <div>
      {listNames.map((listName, index) => (
        <ListBox listName={listName} key={index} listId={listName} />
      ))}
    </div>
  );
}

export default Lists;
