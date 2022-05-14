const BingoContainer = (): JSX.Element => {
  const localFields = localStorage.getItem("fields")
    ? JSON.parse(String(localStorage.getItem("fields")))
    : [];

  const [fields, setFields] = React.useState(localFields);

  const onChange = (id: number, checked: boolean) => {
    let tempFields = fields;
    tempFields[id] = { ...tempFields[id], checked };
    tempFields = JSON.parse(JSON.stringify(tempFields));
    localStorage.setItem("fields", JSON.stringify(tempFields));
    setFields(tempFields);
  };

  const generate = () => {
    fetch("api/fields.php")
      .then((data) => data.json())
      .then((data) =>
        data.map((field) => {
          return { ...field, checked: field.chekced == "t" };
        })
      )
      .then((data) => {
        setFields(data);
        localStorage.setItem("fields", JSON.stringify(data));
      });
  };

  if (fields.length == 0) {
    generate();
  }

  return (
    <>
      <button type="button" onClick={generate}>
        Generer ny
      </button>
      <div className="bingo-container">
        <>
          {fields.map((field, index) => {
            return (
              <BingoField
                key={index}
                id={index}
                content={field.content}
                checked={field.checked}
                onChange={onChange}
              />
            );
          })}
        </>
      </div>
    </>
  );
};

type BingoFieldProps = {
  id: number;
  content: string;
  checked: boolean;
  onChange: (id: number, checked: boolean) => void;
};

const BingoField = ({
  id,
  content,
  checked,
  onChange,
}: BingoFieldProps): JSX.Element => {
  const onClick = () => {
    onChange(id, !checked);
  };

  if (checked) {
    return (
      <div onClick={onClick} className="bingo-field checked">
        <p className="bingo-field-content">{content}</p>
      </div>
    );
  } else {
    return (
      <div onClick={onClick} className="bingo-field unchecked">
        <p className="bingo-field-content">{content}</p>
      </div>
    );
  }
};

const domContainer = document.getElementById("react_root");
ReactDOM.render(
  <React.StrictMode>
    <BingoContainer />
  </React.StrictMode>,
  domContainer
);
