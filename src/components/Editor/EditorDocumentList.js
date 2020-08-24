// Import React dependencies.
import React, { useState } from "react";

import { ListGroup, ListGroupItem } from "reactstrap";

const EditorDocumentList = props => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onClickItem = (data, id, idx) => {
    // console.log(data);
    // console.log(props.documentList);`
    setActiveIndex(idx);
    props.setValue(data.content, id);
  };

  return (
    <ListGroup>
      {props.documentList.map((data, idx) => {
        return (
          <ListGroupItem
            // {activeIndex === idx ? "active" : ""}
            className={activeIndex === idx ? "list-group-item active" : ""}
            tag="button"
            key={data.docData.name}
            id={data.id}
            onClick={() => {
              onClickItem(data.docData, data.id, idx);
            }}
            action
          >
            {data.docData.name}
          </ListGroupItem>
        );
      })}
    </ListGroup>
  );
};

export default EditorDocumentList;
