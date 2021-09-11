const header = document.querySelector("header");
const height = header.clientHeight;
let prev = 0;

document.addEventListener("scroll", () => {
  const current = window.scrollY;
  const delta = prev - current;
  const top = Number(/-?\d*/.exec(header.style.top)[0]) || 0;
  const min = -height;
  const max = 0;
  const newVal = delta + top;
  header.style.top = `${newVal > max ? max : newVal < min ? min : newVal}px`;
  prev = current;
});
