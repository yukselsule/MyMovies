import { useLists } from "../contexts/ListsContext.jsx";
import ListBox from "./ListBox.jsx";
// import List from "./List";

function Lists() {
  const { listNames } = useLists();

  return (
    <div>
      {listNames.map((listName, index) => (
        <ListBox listName={listName} key={index} />
        // <List key={index} listName={listName} />
      ))}
    </div>
  );
}

export default Lists;
