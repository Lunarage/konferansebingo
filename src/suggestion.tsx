const SuggestionContainer = (): JSX.Element => {
  const [content, setContent] = React.useState("");
  const [creator, setCreator] = React.useState("");
  // List of all possible categories
  const [categories, setCategories] = React.useState([]);
  const [checked, setChecked] = React.useState<number[]>([]);

  if (categories.length == 0) {
    fetch("api/categories.php")
      .then((data) => data.json())
      .then((data) => {
        setCategories(data);
      });
  }

  const onCategoryChange = (event) => {
    let tmparray: number[] = checked;
    if(event.target.checked) {
        tmparray.push(event.target.value);
        setChecked(tmparray);
    } else {
        tmparray.splice(tmparray.indexOf(event.target.value), 1);
        setChecked(tmparray);
    }
  }

  const onContentChange = (event) => {
    setContent(event.target.value);
  };

  const onCreatorChange = (event) => {
    setCreator(event.target.value);
  };

  const onSubmit = () => {
    const data = new FormData();
    data.append("content", content);
    data.append("creator", creator);
    checked.forEach((value) => {
        data.append("categories[]", String(value));
    });

    fetch("api/fields.php", {
      method: "POST",
      body: data,
    }).then(() => setContent(""));
  };

  return (
    <div className="suggestion-container">
      <h2>Forslagskasse</h2>
      <label htmlFor="content_input">Innhold</label>
      <input
        id="content_input"
        type="text"
        value={content}
        onChange={onContentChange}
      />
      <label>Kategorier</label>
      <div>
      {
          categories.map((cat: any) => { return(
              <label>
                <input name="category" type="checkbox" value={cat.id} onClick={onCategoryChange} />
                {cat.name}
              </label>
          ); })
      }
      </div>
      <label htmlFor="creator_input">Skaper</label>
      <input
        id="creator_input"
        type="text"
        value={creator}
        onChange={onCreatorChange}
      />
      <button type="button" onClick={onSubmit}>
        Send inn
      </button>
    </div>
  );
};

const suggestionContainer = document.getElementById("react_suggestion");
ReactDOM.render(
  <React.StrictMode>
    <SuggestionContainer />
  </React.StrictMode>,
  suggestionContainer
);
