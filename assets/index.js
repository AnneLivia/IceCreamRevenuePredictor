const btnPredict = document.querySelector(".btn-predict");
const btnTrain = document.querySelector(".btn-train");

const inputTemperatura = document.querySelector("#temperatura");
const inputPath = document.querySelector("#path");

const resultP = document.querySelector("#result");
const loading = document.querySelector(".loading");

btnPredict.disabled = true;

// Step 1: carregar os dados e configurar rede neural
// dataset obtained from https://www.kaggle.com/datasets/vinicius150987/ice-cream-revenue

const options = {
    dataUrl: './assets/IceCreamData.csv',
    task: 'regression',
    inputs: ['Temperature'],
    outputs: ['Revenue'],
    debug: true,
}

// step 2: inicializar a rede neural
const nn = ml5.neuralNetwork(options, () => {
    console.log("Modelo loaded!");
});

// step 3: ao inicializar, normalizar os dados e treinar a rede 
function train () {
    nn.normalizeData();

    const trainingOptions = {
        batchSize: 32,
        epochs: 12,
    };

    const processoDeTreinamento = (epoch, loss) => {
        loading.className = 'loading loader';
        resultP.innerText = "";
        console.log(`epoch: ${epoch}, loss: ${loss}`);
    }

    nn.train(trainingOptions, processoDeTreinamento, () => {
        loading.className = 'loading';
        resultP.innerText = "The model is trained and can already be used.";
        console.log("Model finished the training");
        btnPredict.disabled = false;
    });
}

btnPredict.addEventListener('click', (e) => {
    e.preventDefault();
    const temperature = inputTemperatura.value.trim();
    if(!temperature) {
        resultP.innerText = "Please, enter the temperature in celcius.";
        return inputTemperatura.className = 'form-control is-invalid';
    }
    predict(Number(temperature));
});

btnTrain.addEventListener('click', (e) => {
    e.preventDefault();
    train();
});

function predict (data) {
    nn.predict({'Temperature': data}, (err, result) => {
        if(err){
            console.error(err.message);
            return;
        }

        resultP.innerHTML = `<span>The total revenue is:</span> $ ${result[0].Revenue.toFixed(2)}`
        console.log(result);
    });
}

// neuralNetwork.save(?outputName, ?callback);