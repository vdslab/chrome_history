import React, { useState } from "react";

function InputDate({ yesterday }) {
  if (yesterday) {
    return (
      <div className="field is-grouped is-grouped-multiline">
        <p className="control">
          <input className="input" type="date" defaultValue="0" />
        </p>
      </div>
    );
  } else {
    return <div></div>;
  }
}

function Form(props) {
  function handleSubmit(event) {
    event.preventDefault();
    const date =
      event.target[0].value === "-1"
        ? event.target[1].value
        : event.target[0].value;
    props.onFormSubmit(date);
  }

  const [yesterday, setYesterday] = useState(false);

  const selectChange = (value) => {
    if (value === "-1") {
      setYesterday(true);
    } else {
      setYesterday(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="field">
        <div className="select">
          <select
            defaultValue="0"
            onChange={(event) => selectChange(event.target.value)}
          >
            <option value="0" hidden>
              履歴を取得する期間を選択
            </option>
            <option value="6">過去6時間</option>
            <option value="12">過去12時間</option>
            <option value="24">過去24時間</option>
            <option value="-1">昨日以前</option>
          </select>
        </div>
      </div>

      <InputDate yesterday={yesterday} />

      <button
        className="button is-primary "
        type="submit"
        value="submit"
        onClick={() => {
          props.close();
        }}
      >
        適用
      </button>
    </form>
  );
}

export function FormModal({ show, setShow, setFilter }) {
  function reloadDate(props) {
    setFilter(props);
  }

  function closeModal() {
    setShow("modal");
  }

  return (
    <div className={show}>
      <div className="modal-background" onClick={() => closeModal()}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <div className="container">
            <p className="modal-card-title">日付でフィルタリング</p>
          </div>
          <button className="delete" onClick={() => closeModal()}></button>
        </header>
        <section className="modal-card-body">
          <div className="content">
            <Form onFormSubmit={reloadDate} close={closeModal} />
          </div>
        </section>
      </div>
    </div>
  );
}
