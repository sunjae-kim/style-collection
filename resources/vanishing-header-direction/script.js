const header = document.querySelector('header');
const height = header.clientHeight;
let history = [];
let prev = 0;

document.addEventListener('scroll', () => {
  const current = window.scrollY;
  const delta = prev - current;
  const pivot = 10;
  const min = -height;
  const max = 0;

  // 항상 마지막 pivot 개수만큼만 history 유지
  history.push(delta);
  if (history.length > pivot) history = history.splice(1, pivot);

  // history가 모두 동일한 delta 방향을 가지고 있다면 헤더 toggle
  const upWard = history.every(x => x > 0);
  const downWard = history.every(x => x < 0);

  if (upWard) header.style.top = `${max}px`;
  if (downWard) header.style.top = `${min}px`;

  prev = current;
});
