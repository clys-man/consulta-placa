import { useState } from "react";
import { getPlateInfo } from "./utils/plates";
import { PlateInfo } from "./utils/types";

function App() {
  const [plate, setPlate] = useState<string>("");
  const [plateInfo, setPlateInfo] = useState<PlateInfo>();

  function handleSearch() {
    const plateInfo = getPlateInfo(plate);

    if (plateInfo) {
      setPlateInfo(plateInfo);
    }
  }

  return (
    <div className="App">
      <h1 className="text-2xl">Consulta placa</h1>
      <p className="text-xl">Digite a placa do veículo</p>
      <div className="flex items-center border-b border-teal-500 py-2">
        <input
          className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          type="text"
          placeholder="ABC-1234"
          aria-label="Placa do veiculo"
          onChange={(e) => setPlate(e.target.value)}
        />
        <button
          className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
          type="button"
          onClick={handleSearch}
        >
          Buscar
        </button>
        <button
          className="flex-shrink-0 border-transparent border-4 text-teal-500 hover:text-teal-800 text-sm py-1 px-2 rounded"
          type="button"
          onClick={() => setPlate("")}
        >
          Cancelar
        </button>
      </div>

      {plateInfo && (
        <div className="mt-4">
          {plateInfo.state
            ? (
              <>
                <p className="text-teal-500 text-2xl">
                  Estado: {plateInfo.state.name}
                </p>
                <p className="text-teal-500 text-2xl">
                  UF: {plateInfo.state.abbreviation}
                </p>
                <p className="text-teal-500 text-2xl">
                  Região: {plateInfo.state.region.name}
                </p>
              </>
            )
            : <p>Sequência ainda não definida</p>}
        </div>
      )}
    </div>
  );
}

export default App;
