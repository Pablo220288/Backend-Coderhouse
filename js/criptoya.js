const consultaDolar = async () => {
  const promesa = await fetch("https://criptoya.com/api/dolar");
  const data = await promesa.json();
  return data;
};

consultaDolar().then(data => console.log(data))

/* fetch("https://criptoya.com/api/dolar")
  .then((response) => response.json())
  .then(({ oficial, solidario, blue, mep }) => {
    console.log(oficial, solidario, blue, mep);
  });
 */