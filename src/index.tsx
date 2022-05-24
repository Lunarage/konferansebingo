/**
 * BingoContainer
 * The board and main component
 *
 * @returns {JSX.Element}
 */
const BingoContainer = (): JSX.Element => {
  const localFields = localStorage.getItem("fields")
    ? JSON.parse(String(localStorage.getItem("fields")))
    : [];

  const [fields, setFields] = React.useState(localFields);

  /* Procedure for what happens when a field is toggled */
  const onChange = (id: number, checked: boolean) => {
    let tempFields = fields;
    tempFields[id] = { ...tempFields[id], checked };
    tempFields = JSON.parse(JSON.stringify(tempFields));
    localStorage.setItem("fields", JSON.stringify(tempFields));
    setFields(tempFields);
  };

  /* Procedure for fetching a new set of fields for the board */
  const generate = (category: number = 0) => {
    fetch(`api/fields.php?category=${category}`)
      .then((data) => data.json())
      .then((data) =>
        data.map((field) => {
          return { ...field, checked: false };
        })
      )
      .then((data) => {
        setFields(data);
        localStorage.setItem("fields", JSON.stringify(data));
      });
  };

  /* Generate new fields if local storage is empty */
  if (fields.length == 0) {
    generate();
  }

  return (
    <>
      <BingoGenerator generate={generate} />
      <div className="bingo-container">
        <>
          {fields.map((field: any, index) => {
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

/**
 * Bingo Field
 * A single field in the board.
 *
 * @param props
 * @param props.id - index in array of fields
 * @param props.content - the string
 * @param props.checked - checked or not
 * @param props.onChange - function on click
 * @returns {JSX.Element}
 */
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

type BingoGeneratorProps = {
  generate: (cateogory: number) => void;
};

const BingoGenerator = ({ generate }: BingoGeneratorProps): JSX.Element => {
  // List of all possible categories
  const [categories, setCategories] = React.useState([]);
  // Chosen category
  const [category, setCategory] = React.useState(0);

  const onChange = (event) => {
    setCategory(event.target.value);
  }

  const onSubmit = () => {
    generate(category);
  }

  if (categories.length == 0) {
    fetch("api/categories.php")
      .then((data) => data.json())
      .then((data) => {
        setCategories(data);
      });
  }

  return (
    <div className="bingo-generator">
      <button type="button" onClick={onSubmit}>
        Generer ny
      </button>
      <p>Kategori:</p>
      <label>
        <input name="category" type="radio" value={0} onChange={onChange} checked={category == 0}/>
        Alt
      </label>
      {
          categories.map((cat: any) => { return(
              <label>
                <input name="category" type="radio" value={cat.id} onChange={onChange} checked={category == cat.id} />
                {cat.name}
              </label>
          ); })
      }
    </div>
  );
};

/* Main render */
const domContainer = document.getElementById("react_root");
ReactDOM.render(
  <React.StrictMode>
    <BingoContainer />
  </React.StrictMode>,
  domContainer
);
