// Import React dependencies.
import React, { useEffect, useMemo, useState, useCallback } from "react";
// Import the Slate editor factory.
import { createEditor, Editor, Transforms, Text } from "slate";

// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from "slate-react";

const EditorPanel = props => {
  const editor = useMemo(() => withReact(createEditor()), []);

  // Define a rendering function based on the element passed to `props`. We use
  // `useCallback` here to memoize the function for subsequent renders.
  const renderElement = useCallback(props => {
    console.log(props.element.type);
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  // Define a leaf rendering function that is memoized with `useCallback`.
  const renderLeaf = useCallback(props => {
    return <Leaf {...props} />;
  }, []);

  return (
    <div>
      <Slate
        editor={editor}
        value={props.value.content}
        onChange={value => {
          props.setValue(value, props.value.id);

          // Save the value to Local Storage.
          //   const content = JSON.stringify(value);
          //   localStorage.setItem("content", content);
        }}
      >
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={event => {
            if (!event.ctrlKey) {
              return;
            }

            switch (event.key) {
              // When "`" is pressed, keep our existing code block logic.
              case "`": {
                event.preventDefault();
                const [match] = Editor.nodes(editor, {
                  match: n => n.type === "code"
                });
                Transforms.setNodes(
                  editor,
                  { type: match ? "paragraph" : "code" },
                  { match: n => Editor.isBlock(editor, n) }
                );
                break;
              }

              // When "B" is pressed, bold the text in the selection.
              case "b": {
                event.preventDefault();
                Transforms.setNodes(
                  editor,
                  { bold: true },
                  // Apply it to text nodes, and split the text node up if the
                  // selection is overlapping only part of it.
                  { match: n => Text.isText(n), split: true }
                );
                break;
              }
            }
          }}
        />
      </Slate>
      <button onClick={props.saveDocument}>Add Instruction</button>
    </div>
  );
};

/////TODO: All elements and leafs as individual components
const CodeElement = props => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};
const DefaultElement = props => {
  return <p {...props.attributes}>{props.children}</p>;
};

const Leaf = props => {
  return (
    <span
      {...props.attributes}
      style={{ fontWeight: props.leaf.bold ? "bold" : "normal" }}
    >
      {props.children}
    </span>
  );
};

export default EditorPanel;
