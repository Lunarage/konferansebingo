const SuggestionContainer = (): JSX.Element => {
  const [content, setContent] = React.useState("");
  const [creator, setCreator] = React.useState("");

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
