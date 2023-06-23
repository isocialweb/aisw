const colors = require('colors');

const clearQuery = (query) => {
  if (typeof query === 'string') {
    const lowerCaseQuery = query.toLowerCase();
    const withoutAccents = lowerCaseQuery
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/[ñ]/g, 'n');
    const cleanText = withoutAccents.replace(/[^\w\s]/gi, '');
    const splitQuery = cleanText.split(' ');
    const finalQuery = splitQuery.join('+');
    return finalQuery;
  } else {
    throw new Error('La consulta no es una cadena de texto válida');
  }
};

const codeSearchQuery = (query) => {
  if (typeof query === 'string') {
    const lowerCaseQuery = query.toLowerCase();
    const withoutAccents = lowerCaseQuery
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/[ñ]/g, 'n');
    const cleanText = withoutAccents.replace(/[^\w\s]/gi, '');
    return cleanText;
  } else {
    throw new Error('La consulta no es una cadena de texto válida');
  }
};
// parametros &hl=es idioma y &gl=es país
const navigateToQuery = async (page, query, lowerQuery,timesToExpand = 5, country = "es") => {
  await page.goto(`https://google.com/search?q=${query}&gl=${country}`);
  console.log(`${colors.green('Query:')} ${query}`);
  await page.setViewport({ width: 1080, height: 1024 });
  await page.screenshot({
    path: 'screenshoot-cookies.jpg',
  });
  await acceptCookies(page);

  console.log('lowerQuery:', lowerQuery);
  // Lógica de DIVS para encontrar PPAA
  const jsnameHandle = await page.waitForXPath(
    `//*[@data-initq='${lowerQuery}']/div/div[@jsname]/@jsname`,
  );
  const firstJsname = await page.evaluate(
    (element) => element.textContent,
    jsnameHandle,
  );
  console.log(colors.red(firstJsname));
  const secondJsHandle = await page.waitForXPath(
    `(//*[@jsname='${firstJsname}']//*[@jsname]/@jsname)[1]`,
  );
  const secondJsName = await page.evaluate(
    (element) => element.textContent,
    secondJsHandle,
  );
  console.log(colors.red(secondJsName));

  // Sacamos los 4 primeros PPAA
  let ppaaHandles = await page.$x(
    `//*[@jsname='${secondJsName}']//*[@data-q]/@data-q`,
  );
  let ppaaHandlesNodes = await page.$x(
    `//*[@jsname='${secondJsName}']//*[@data-q]`,
  );

  // Crear una matriz para almacenar los resultados
  const listofPpaa = [];
  const ppaaDivs = [];
  let buttonHandles = [];

  const maxPpaa = timesToExpand; // Cambia esto al número máximo de elementos que quieres abrir aproximadamente
  let expandedPpaa = 0;

  while (expandedPpaa < maxPpaa) {
    // Obtiene los nodos actuales en cada iteración
    ppaaHandlesNodes = await page.$x(
      `//*[@jsname='${secondJsName}']//*[@data-q]`,
    );

    buttonHandles = [];
    for (let handle of ppaaHandlesNodes) {
      let buttons = await handle.$x(
        ".//div[@role='button' and @aria-expanded='false']",
      );
      buttonHandles.push(...buttons);
    }

    if (buttonHandles.length > 0) {
      for (let button of buttonHandles) {
        // Comprobamos si el botón ya está expandido
        const expanded = await button.evaluate(
          (node) => node.getAttribute('aria-expanded') === 'true',
        );

        if (!expanded) {
          // Si no está expandido, hacemos click y incrementamos el contador
          await button.click();
          expandedPpaa += 2;
          await new Promise((resolve) => setTimeout(resolve, 2000)); // Esperamos 2 segundos
          if (expandedPpaa >= maxPpaa) break;
        }
      }
    }
  }

  ppaaHandles = await page.$x(
    `//*[@jsname='${secondJsName}']//*[@data-q]/@data-q`,
  );

  for (let handle of ppaaHandles) {
    let text = await page.evaluate((element) => element.textContent, handle);
    ppaaDivs.push(handle);
    listofPpaa.push(text);
  }

  console.log(listofPpaa);
  return listofPpaa
};

const acceptCookies = async (page) => {
  try {
    await page.waitForXPath("//div[text()='Aceptar todo']");
    const acceptButton = await page.$x("//div[text()='Aceptar todo']");
    await acceptButton[0].click();
  } catch (err) {
    console.log(err);
  }
};
module.exports = {
  clearQuery,
  codeSearchQuery,
  navigateToQuery,
  acceptCookies
};
