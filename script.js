const getSelectedResource = () => {
  const x = localStorage.getItem("selected-resource");
  return resources.includes(x) ? x : null;
};

// Init resizer
{
  const main = document.querySelector('#main');
  const nav = document.querySelector('#nav');
  const viewer = document.querySelector('#viewer');
  const resizer = document.querySelector('#resizer');

  let width = 0;
  let height = 0;
  let isResizing = false;
  let isMobile = false;
  let clientX, clientY;
  const resizeWidth = localStorage.getItem('resize-val');

  const onWindowResize = () => {
    width =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    height =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;

    if (width > height) {
      main.style.flexDirection = 'row';
      main.classList.add('window');
      main.classList.remove('mobile');
      isMobile = false;
    } else {
      main.style.flexDirection = 'column-reverse';
      main.classList.add('mobile');
      main.classList.remove('window');
      isMobile = true;
    }
  };

  const toggleResize = () => {
    isResizing = !isResizing;
    resizer.classList.toggle('active');
    viewer.classList.toggle('resizing');
    const cursor = isMobile ? 'row-resize' : 'col-resize';
    document.body.style.cursor = isResizing ? cursor : 'default';
  };

  const resize = val => {
    const pivot = isMobile ? height : width;
    const min = 100;
    const max = pivot / 2;
    const targetVal = val + 'px';

    if (
      isResizing &&
      val > min &&
      val < max &&
      nav.style.flexBasis !== targetVal
    ) {
      nav.style.flexBasis = targetVal;
      localStorage.setItem('resize-val', targetVal);
    }
  };

  window.addEventListener('resize', onWindowResize);
  resizer.addEventListener('dragstart', e => e.preventDefault());

  // Window Mouse Event
  resizer.addEventListener('mousedown', toggleResize);
  document.addEventListener('mouseup', () => isResizing && toggleResize());
  document.addEventListener('mousemove', e => {
    resize(isMobile ? height - e.y : e.x);
  });

  // Mobile Touch Event
  resizer.addEventListener('touchstart', e => {
    toggleResize();
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  });
  document.addEventListener('touchend', () => isResizing && toggleResize());
  document.addEventListener('touchmove', e => {
    const deltaX = e.changedTouches[0].clientX - clientX;
    const deltaY = e.changedTouches[0].clientY - clientY;
    const xy = isMobile ? height - clientY - deltaY : clientX + deltaX;
    resize(xy);
  });

  // Main
  {
    const resizeWidth = localStorage.getItem("resize-width");
    if (resizeWidth) nav.style.flexBasis = resizeWidth;
    onWindowResize();
  }
}

// Init resource list
{
  const ul = document.querySelector("#nav > ul");
  const iframe = document.querySelector("iframe");
  const selectedResource = getSelectedResource();
  let activeListItem;

  const onResourceChange = (resource, li) => {
    iframe.src = `resources/${resource}/index.html`;
    activeListItem?.classList.toggle('active');
    li.classList.toggle('active');
    localStorage.setItem('selected-resource', resource);
    activeListItem = li;
  };

  resources.forEach((resource, idx) => {
    const li = document.createElement('li');
    li.innerText = resource;
    li.addEventListener('click', () => onResourceChange(resource, li));
    ul.append(li);
  });

  onResourceChange(
    selectedResource || resources[0],
    Array.from(ul.children).find(
      ({ innerText }) => innerText === selectedResource,
    ) || ul.firstChild,
  );
}

// Viewer nav
{
  const resourceListEl = document.querySelector("#nav > ul");
  const viewerNavEl = document.querySelector("#viewerNav");
  const codeViewer = document.querySelector("#codeViewer");
  const iframe = document.querySelector("iframe");
  let selectedResource = getSelectedResource() || resources[0];
  let selectedView;
  let selectedViewLi;

  const genFileList = (selectedResource) => {
    // Viewer 외 메뉴 제외
    while (viewerNavEl.children.length > 1) viewerNavEl.lastChild.remove();
    const fileList = Object.keys(fileMap[selectedResource]);
    for (const file of fileList) {
      const li = document.createElement("li");
      li.innerText = file.toUpperCase();
      viewerNavEl.append(li);
      li.addEventListener("click", function () {
        selectView(this, file);
      });
    }
  };

  const selectView = (li, menu) => {
    selectedViewLi?.classList.toggle("active");
    li.classList.toggle("active");
    selectedViewLi = li;
    selectedView = menu;

    if (selectedView !== "viewer") {
      iframe.style.display = "none";
      codeViewer.style.display = "block";
      const content = fileMap[selectedResource][selectedView];
      codeViewer.innerText = content;
      codeViewer.scrollTo(0, 0);
    } else {
      iframe.style.display = "block";
      codeViewer.style.display = "none";
      iframe.scrollTo(0, 0);
    }
  };

  viewerNavEl.firstElementChild.addEventListener("click", function () {
    selectView(this, "viewer");
  });

  for (const item of resourceListEl.children) {
    item.addEventListener("click", () => {
      selectedResource = item.innerText;
      genFileList(selectedResource);
      selectView(viewerNavEl.firstElementChild, "viewer");
    });
  }

  genFileList(selectedResource);
  selectView(viewerNavEl.firstElementChild, "viewer");
}
