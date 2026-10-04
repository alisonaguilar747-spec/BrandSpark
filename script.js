/* ================= NAVBAR ================= */

const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 30) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});


/* ================= MOBILE MENU ================= */

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});

document.querySelectorAll(".nav-menu a").forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
  });
});


/* ================= ANALYTICS ================= */

let campaigns = JSON.parse(
  localStorage.getItem("brandSparkCampaigns")
) || [];

const campaignForm = document.getElementById("campaignForm");
const campaignTableBody = document.getElementById("campaignTableBody");
const emptyMessage = document.getElementById("emptyMessage");

const totalConsultas = document.getElementById("totalConsultas");
const totalVentas = document.getElementById("totalVentas");
const totalIngresos = document.getElementById("totalIngresos");
const conversionTotal = document.getElementById("conversionTotal");


/* ================= GUARDAR ================= */

function saveCampaigns() {
  localStorage.setItem(
    "brandSparkCampaigns",
    JSON.stringify(campaigns)
  );
}


/* ================= FORMATEAR DINERO ================= */

function formatCurrency(value) {
  return new Intl.NumberFormat("es-SV", {
    style: "currency",
    currency: "USD"
  }).format(value);
}


/* ================= CALCULAR CONVERSIÓN ================= */

function calculateConversion(queries, sales) {

  if (!queries || queries <= 0) {
    return 0;
  }

  return ((sales / queries) * 100).toFixed(1);
}


/* ================= RENDERIZAR TABLA ================= */

function renderCampaigns() {

  campaignTableBody.innerHTML = "";

  if (campaigns.length === 0) {
    emptyMessage.style.display = "block";
  } else {
    emptyMessage.style.display = "none";
  }

  campaigns.forEach((campaign, index) => {

    const conversion = calculateConversion(
      campaign.queries,
      campaign.sales
    );

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${campaign.date}</td>

      <td>
        <strong>${escapeHTML(campaign.name)}</strong>
      </td>

      <td>${escapeHTML(campaign.product)}</td>

      <td>${campaign.queries}</td>

      <td>${campaign.sales}</td>

      <td>${formatCurrency(campaign.income)}</td>

      <td>${escapeHTML(campaign.medium)}</td>

      <td>
        <strong>${escapeHTML(campaign.code)}</strong>
      </td>

      <td>
        <span class="conversion-badge">
          ${conversion}%
        </span>
      </td>

      <td>
        <button
          class="delete-row"
          onclick="deleteCampaign(${index})"
          title="Eliminar campaña"
        >
          🗑️
        </button>
      </td>
    `;

    campaignTableBody.appendChild(row);

  });

  updateTotals();
}


/* ================= SEGURIDAD HTML ================= */

function escapeHTML(text) {

  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}


/* ================= ACTUALIZAR TOTALES ================= */

function updateTotals() {

  const queries = campaigns.reduce(
    (sum, campaign) => sum + Number(campaign.queries),
    0
  );

  const sales = campaigns.reduce(
    (sum, campaign) => sum + Number(campaign.sales),
    0
  );

  const income = campaigns.reduce(
    (sum, campaign) => sum + Number(campaign.income),
    0
  );

  const conversion =
    queries > 0
      ? ((sales / queries) * 100).toFixed(1)
      : 0;

  totalConsultas.textContent = queries;
  totalVentas.textContent = sales;
  totalIngresos.textContent = formatCurrency(income);
  conversionTotal.textContent = `${conversion}%`;
}


/* ================= AGREGAR CAMPAÑA ================= */

campaignForm.addEventListener("submit", (event) => {

  event.preventDefault();

  const campaign = {

    date: document.getElementById("campaignDate").value,

    name: document.getElementById("campaignName").value,

    product: document.getElementById("campaignProduct").value,

    queries: Number(
      document.getElementById("campaignQueries").value
    ),

    sales: Number(
      document.getElementById("campaignSales").value
    ),

    income: Number(
      document.getElementById("campaignIncome").value
    ),

    medium: document.getElementById("campaignMedium").value,

    code: document.getElementById("campaignCode").value

  };

  campaigns.push(campaign);

  saveCampaigns();

  renderCampaigns();

  campaignForm.reset();

  document.getElementById("campaignQueries").value = 0;
  document.getElementById("campaignSales").value = 0;
  document.getElementById("campaignIncome").value = 0;

});


/* ================= ELIMINAR CAMPAÑA ================= */

function deleteCampaign(index) {

  campaigns.splice(index, 1);

  saveCampaigns();

  renderCampaigns();
}


/* ================= LIMPIAR DATOS ================= */

const clearData = document.getElementById("clearData");

clearData.addEventListener("click", () => {

  if (campaigns.length === 0) {
    return;
  }

  const confirmation = confirm(
    "¿Seguro que deseas eliminar todas las campañas registradas?"
  );

  if (confirmation) {

    campaigns = [];

    saveCampaigns();

    renderCampaigns();

  }

});


/* ================= CONTACTO ================= */

const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", (event) => {

  event.preventDefault();

  const name = document.getElementById("name").value;

  alert(
    `¡Gracias, ${name}! Tu mensaje ha sido preparado correctamente.`
  );

  contactForm.reset();

});


/* ================= INICIAR ================= */

renderCampaigns();
