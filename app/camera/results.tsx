import React, { useCallback, useState } from "react";
import { store } from '../../redux/store';
import { Text, View } from '../../components/Themed';
import Canvas, { Image as CanvasImage, Path2D } from "react-native-canvas"
import { FlatList } from "react-native-gesture-handler";


const boxColors = [
  "rgba(255, 0, 0, 0.2)",
  "rgba(0, 255, 0, 0.2)",
  "rgba(0, 0, 255, 0.2)",
  "rgba(255, 255, 0, 0.2)",
  "rgba(255, 0, 255, 0.2)",
  "rgba(0, 255, 255, 0.2)",
  "rgba(255, 127, 0, 0.2)",
  "rgba(255, 0, 127, 0.2)",
  "rgba(0, 255, 127, 0.2)",
  "rgba(127, 127, 0, 0.2)",
  "rgba(127, 0, 127, 0.2)",
  "rgba(0, 127, 127, 0.2)",
];
const colors = [
  "rgba(255, 0, 0, 1.0)",
  "rgba(0, 255, 0, 1.0)",
  "rgba(0, 0, 255, 1.0)",
  "rgba(255, 255, 0, 1.0)",
  "rgba(255, 0, 255, 1.0)",
  "rgba(0, 255, 255, 1.0)",
  "rgba(255, 127, 0, 1.0)",
  "rgba(255, 0, 127, 1.0)",
  "rgba(0, 255, 127, 1.0)",
  "rgba(127, 127, 0, 1.0)",
  "rgba(127, 0, 127, 1.0)",
  "rgba(0, 127, 127, 1.0)",
];

interface Result {
  text: string,
  poly: number[][],
}

async function submitMock(image: string, endpoint: string): Promise<Result[]> {
  return [
    {"poly": [[662, 729], [664, 667], [770, 672], [768, 733]], "text": "fin"},
    {"poly": [[276, 723], [279, 666], [475, 676], [472, 733]], "text": "suppr"},
    {"poly": [[637, 368], [638, 319], [829, 322], [828, 371]], "text": "debut"},
    {"poly": [[297, 370], [298, 319], [454, 321], [454, 372]], "text": "inser"},
  ];
}

async function submit(image: string, endpoint: string): Promise<Result[]> {
  const response = await fetch(
    endpoint, 
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({image})
    }
  );
  return await response.json()
}

async function getResults(data: string): Promise<Result[]> {
  const {appSubdomain, region, path} = store.getState().settings;
  const kind = store.getState().analysis.kind;

  let relPath = path;
  if (relPath.startsWith("/")) {
    relPath = relPath.substring(1);
  }
  const url = `https://${appSubdomain}.execute-api.${region}.amazonaws.com/${relPath}/${kind}`

  return await submit(data, url);
}

function formatResults(results: Result[]): string {
  let res = "";
  for (const {text, poly} of results) {
    res += `Text: ${text}\n`
  }
  return res
}


function draw(canvas: Canvas, results: Result[], resultsObj: FormattedResult[]): void {
  const context = canvas.getContext("2d");
  const scale = 0.5;
  let colorIdx = 0;
  for (const {text, poly} of results) {
    const path = new Path2D(canvas);
    path.moveTo(poly[0][0] * scale, poly[0][1] * scale);
    path.lineTo(poly[1][0] * scale, poly[1][1] * scale);
    path.lineTo(poly[2][0] * scale, poly[2][1] * scale);
    path.lineTo(poly[3][0] * scale, poly[3][1] * scale);
    path.closePath();
    context.fillStyle = boxColors[colorIdx];
    context.strokeStyle = boxColors[colorIdx];
    context.fill(path);
    context.stroke(path);
    context.stroke(path);
    context.stroke(path);
    context.stroke(path);
    // context.font = "24px serif";
    // context.strokeText(text, poly[1][0] * scale, poly[1][1] * scale);
    // context.fillText(text, poly[1][0] * scale, poly[1][1] * scale);
    resultsObj.push({
      text,
      coordinates: poly,
      style: {color: colors[colorIdx]}
    })
    colorIdx = (colorIdx + 1) % colors.length;

  }
}

interface FormattedResult {
  text: string,
  coordinates: number[][],
  style: Array<Record<string, any>>,
}

export default function ResultsScreen(): React.JSX.Element {
  const {data, width, height} = store.getState().analysis.image;
  let uri = data;
  if (!uri.startsWith("data:")) {
    uri = `data:image/png;base64,${data}`;
  }
  const resultsPromise = getResults(data);
  const [results, setResults] = useState("");
  const [resultsObj, setResultsObj] = useState([]);

  const canvasRef = useCallback((canvas: Canvas) => {
    if (canvas !== null) {
      canvas.width = width / 2;
      canvas.height = height / 2;
      const context = canvas.getContext("2d");

      const image = new CanvasImage(canvas);
      image.src = uri;
      image.addEventListener("load", () => {
        context.drawImage(image, 0, 0, width / 2, height / 2);
      });

      image.addEventListener("load", async () => {
        try {
          const results_ = await resultsPromise;
          setResults(formatResults(results_));
          draw(canvas, results_, resultsObj);
        } catch (err) {
          console.log(err);
        }
      });
    } 
  }, []);

  function renderItem(item: FormattedResult): React.JSX.Element {
    return (
      <Text style={[item.style, {fontSize: 20}]}>
        Text: {item.text} (Coordinates: {item.coordinates.join(",")})
      </Text>
    );
  }

  return (
    <View style={{flex: 1, overflowY: "scroll"}}>
      <Canvas style={{flex: 1, width, height}} ref={canvasRef}/>
      <FlatList style={{flex: 1}} data={resultsObj} renderItem={({item}) => renderItem(item)}>
      </FlatList>
    </View>
  )
}

