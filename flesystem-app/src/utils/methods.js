import * as d3 from 'd3';
import moment from 'moment';

export function formatNumber(num) {
  if(!num && num !== 0){
    console.log("No hay número", num)
  }
  if (!num) return "0";
  return num.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export const formatPrice = (value, decimal_places) => {
    let price = parseFloat(value).toFixed(decimal_places)
  
    let int = price.split('.')[0]
    let decimal = price.split('.')[1]
  
    for(let i = 0; i < decimal_places - decimal.length; i++) {
      decimal += '0'
    }
  
    price = `${int}.${decimal}`
  
    return price
}

export const getProductQuantityByUnit = (product, slash, onlyMasure) => {
  if (!product) return '0.00 / Kg.'; // Default value
  let quantity = 0
  quantity = product.quantity;

  const unitOfMeasure = String(product?.unit_of_measure);
  let formattedUnitOfMeasure = unitOfMeasure?.charAt(0)?.toUpperCase() + unitOfMeasure?.slice(1);
  console.log("formattedUnitOfMeasure", product)
  if(Boolean(formattedUnitOfMeasure) === false){
    formattedUnitOfMeasure = unitOfMeasure;
  }
  let string_base = '';
  if(!onlyMasure){
    string_base = formatNumber(quantity) +`${slash ? '/' : ' '}`;
  }
  return string_base + formattedUnitOfMeasure + ".";
}

export const generatePieChartImages = (data) => {
  const width = 200;
  const height = 200;
  const radius = Math.min(width, height) / 2;
  const colors = [
    "#00BFFF", // Azul profundo
    "#1E90FF", // Azul dodger
    "#0170cb", // Azul luminoso
    "#3739c8", // Azul neón oscuro
  ];
  const color = d3.scaleOrdinal()
      .domain(data.map(d => d.label))
      .range(colors);

  const pie = d3.pie()
      .value(d => d.value);

  const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

  const svgPie = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

  svgPie.selectAll(".arc")
      .data(pie(data))
      .enter().append("path")
      .attr("d", arc)
      .style("fill", (d, i) => color(i))
      .style("stroke", "white")
      .style("stroke-width", "0.4px");

  const pieChartImage = new XMLSerializer().serializeToString(svgPie.node());
  const pieChartSVG = svgPie.node().outerHTML;
  const pieChartBase64 = `data:image/svg+xml;base64,${btoa(pieChartImage)}`;

  const maxLabelLength = Math.max(...data.map(d => d.label.length));
  const legendWidth = maxLabelLength * 10;

  const svgLegend = d3.create("svg")
      .attr("width", legendWidth)
      .attr("height", data.length * 20)
      .attr("color", "blue")
      .attr("font-family", "Arial, sans-serif") // Fuente más suave
      .attr("font-weight", "bold"); // Texto en negrita

  const legend = svgLegend.selectAll(".legend-item")
      .data(data)
      .enter().append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(0, ${i * 20})`);

  legend.append("rect")
      .attr("x", 0)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", (d, i) => {
          // Cambiar a un azul más claro para la leyenda
          return d3.rgb(color(i)).brighter(0.1); // Aumenta el brillo del color original
      });

  legend.append("text")
      .attr("x", 25)
      .attr("y", 15)
      .text(d => d.label)
      .style("font-size", "12px") // Tamaño de fuente ajustado
      .style("alignment-baseline", "middle") // Alineación vertical
      .style("dominant-baseline", "middle") // Asegura una alineación vertical consistente
      .style("text-rendering", "optimizeLegibility") // Mejora la legibilidad
      .style("fill", "#3B82F6"); // Cambia este color para ajustar el tono de azul


  const legendImage = new XMLSerializer().serializeToString(svgLegend.node());
  const legendBase64 = `data:image/svg+xml;base64,${btoa(legendImage)}`;

  return { legendBase64, pieChartSVG };
};
export default generatePieChartImages;


export const obtainFirstAndLastDayOfMonth = (month) => {
  const firstDay = new Date(new Date().getFullYear(), month - 1, 1)
  const lastDay = new Date(new Date().getFullYear(), month, 0)

  //formatear la fecha:
  const firstDayFormated = firstDay.getFullYear() + "-" + (firstDay.getMonth() + 1) +  "-" + firstDay.getDate()
  const lastDayFormated = lastDay.getFullYear() + "-" + (lastDay.getMonth() + 1) +  "-" + lastDay.getDate()

  return {firstDayFormated, lastDayFormated}
}


export const getRentabilityDashboardData = (fromDate, toDate, getRentabilityDashboard, office) => {
  if(fromDate && toDate){
    const from_date = moment(fromDate).format("YYYY-MM-DD")
    const to_date = moment(toDate).format("YYYY-MM-DD")
    getRentabilityDashboard(office?.id, "subsidiary", "rentability", from_date, to_date)
  }else{
    getRentabilityDashboard(office?.id, "subsidiary", "rentability")
  }
}

export const getLocationContext = (setIsRentability, setFutureType, futureType) => {
  const isRentability = location?.pathname?.includes("business-profitability/")
  setIsRentability(isRentability)
  const isFuture = location?.pathname?.includes("pending-bills/") || location?.pathname?.includes("business-expenses/")
  let futureTypeToMark = null
  if(isFuture){
    futureTypeToMark = location.pathname.split("/")[1]
    setFutureType(futureTypeToMark)
    console.log(futureType, futureTypeToMark, futureType == futureTypeToMark)
    if(futureType == futureTypeToMark) return
  }

  return [isRentability, isFuture, futureTypeToMark]
}