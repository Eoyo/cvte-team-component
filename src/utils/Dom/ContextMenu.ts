const ContextMenuDisable = () => {
  $(document).on("contextmenu", "*", ev => {
    const currentEle = ev.target;
    console.log(
      // @ts-ignore
      currentEle,
      // @ts-ignore
      currentEle.className.indexOf("context-menu-enable") === -1
    );
    // @ts-ignore
    if (currentEle.className.indexOf("context-menu-enable") === -1) {
      ev.preventDefault();
      ev.stopPropagation();
    }
  });
};

export { ContextMenuDisable };
