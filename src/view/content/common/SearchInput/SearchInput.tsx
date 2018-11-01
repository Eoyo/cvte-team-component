import { Component } from "react";
import { Input } from "antd";
import * as React from "react";
import "./style.scss";

export type SearchInputProps = {
  keyword?: string;
  prefixIcon?: string;
  isError?: boolean;
  className?: string;
  placeholder?: string;
  maxLength?: number;
  focus?: boolean;

  searchkeyWord?: Function;
  onInput?: Function;
  onKeyUp?: Function;
  clear: Function;
  onChange?: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: Function;
};
export class SearchInput extends Component<SearchInputProps> {
  public state = {
    keyword: this.props.keyword,
    inputId: "search-input__inner" + Math.ceil(Math.random() * 1000),
  };
  input: HTMLInputElement | null = null;
  componentDidUpdate() {
    const p = this.props;
    if (this.input && p.focus) {
      if (document.activeElement !== this.input) {
        this.input.focus();
      }
    }
  }
  setKeyWord = (ev: any) => {
    let str = ev.target.value;
    let p = this.props;
    if (p.maxLength) {
      if (str.length > p.maxLength) {
        this.setState({
          keyword: str.slice(0, p.maxLength),
        });
      }
    } else {
      this.setState({
        keyword: str,
      });
    }
  };

  public render() {
    const p = this.props;

    this.state.keyword = this.props.keyword;

    const { keyword, inputId } = this.state;
    return (
      <div
        id={inputId}
        className={`search-input ${p.className} ${
          p.isError ? "is-error" : ""
        } ${p.prefixIcon ? "with-prefixicon" : ""}`}
      >
        {p.prefixIcon ? (
          <Input
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            autoFocus={true}
            className="search-input__inner"
            placeholder={p.placeholder}
            prefix={
              <i
                className={`teams-icon icon-${p.prefixIcon}`}
                onClick={() => {
                  typeof p.searchkeyWord === "function" && p.searchkeyWord();
                }}
              />
            }
            suffix={
              this.state.keyword ? (
                <i
                  className="teams-icon icon-del"
                  onClick={ev => {
                    this.setState({
                      keyword: "",
                    });
                    typeof p.clear === "function" && p.clear();
                  }}
                />
              ) : null
            }
            onInput={ev => {
              typeof p.onInput === "function" && p.onInput(ev);
              this.setKeyWord(ev);
            }}
            onBlur={ev => {
              if (p.onBlur) {
                p.onBlur();
              }
            }}
            onKeyUp={ev => {
              typeof p.onKeyUp === "function" && p.onKeyUp(ev);
              this.setKeyWord(ev);
            }}
            onChange={ev => {
              typeof p.onChange === "function" && p.onChange(ev);
              this.setKeyWord(ev);
            }}
            maxLength={p.maxLength}
            value={keyword}
            ref={ele => {
              ele && (this.input = ele.input);
            }}
          />
        ) : (
          <Input
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            autoFocus={true}
            placeholder={p.placeholder}
            maxLength={p.maxLength}
            className="search-input__inner"
            suffix={
              this.state.keyword ? (
                <i
                  className="teams-icon icon-del"
                  onClick={ev => {
                    this.setState({
                      keyword: "",
                    });
                    typeof p.clear === "function" && p.clear();
                  }}
                />
              ) : null
            }
            onBlur={ev => {
              if (p.onBlur) {
                p.onBlur();
              }
            }}
            onInput={ev => {
              typeof p.onInput === "function" && p.onInput(ev);
              this.setKeyWord(ev);
            }}
            onKeyUp={ev => {
              typeof p.onKeyUp === "function" && p.onKeyUp(ev);
              this.setKeyWord(ev);
            }}
            onChange={ev => {
              typeof p.onChange === "function" && p.onChange(ev);
            }}
            value={keyword}
            ref={ele => {
              ele && (this.input = ele.input);
            }}
          />
        )}
      </div>
    );
  }
}
