export function renderStars(rating) {
  let starsHtml = "";
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  for (let i = 0; i < fullStars; i++) {
    starsHtml += '<i class="bi bi-star-fill"></i>';
  }

  if (halfStar === 1) {
    starsHtml += '<i class="bi bi-star-half"></i>';
  }

  for (let i = 0; i < emptyStars; i++) {
    starsHtml += '<i class="bi bi-star"></i>';
  }

  return starsHtml;
}