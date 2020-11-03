import React, { useCallback } from "react";
import "./App.css";
import { ForceGraph2D } from "react-force-graph";
import data from "./kongweilifemap.json";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";


const App = () => {

  const useStyles = makeStyles((theme) => ({
    typography: {
      padding: theme.spacing(2),
    },
  }));

  const classes = useStyles();
  let initialAnchor: number = 0;

  const [anchorX, setAnchorX] = React.useState(initialAnchor);
  const [anchorY, setAnchorY] = React.useState(initialAnchor);

  const handleClick = (node: any, event: MouseEvent) => {
    setAnchorX(event.x);
    setAnchorY(event.y);
  };

  const handleClose = () => {
    setAnchorX(0);
    setAnchorY(0);
  };

  const open = Boolean(anchorX && anchorY);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <Popover
        id={id}
        open={open}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={{ top: anchorY, left: anchorX }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Typography className={classes.typography}>
          The content of the Popover.
        </Typography>
      </Popover>
      <ForceGraph2D
        graphData={data}
        nodeLabel="id"
        nodeAutoColorBy="group"
        linkDirectionalParticles="value"
        linkDirectionalParticleSpeed={0.01}
        linkDirectionalParticleWidth={5}
        onNodeClick={handleClick}
      />
    </div>
  );
}

export default App;
