import * as React from 'react';
import { styled } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box'
import { SimpleTable } from '../data/OnlyTable.tsx'
import { ThingsProvider } from '../data/ThingContext'
import { ColorTabs } from '../nav/MatchComponent'; 
import _ from 'lodash'



const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    '& .MuiToggleButtonGroup-grouped': {
        margin: theme.spacing(0.5),
        border: 0,
        '&.Mui-disabled': {
            border: 0,
        },
        '&:not(:first-of-type)': {
            borderRadius: theme.shape.borderRadius,
        },
        '&:first-of-type': {
            borderRadius: theme.shape.borderRadius,
        },
    },
}));

const initialstate = {
    games: undefined
}


export const DataContext = props => {

    //const things = React.useContext(ThingsContext)

    let series = props.series
    let stats = props.selected.data
    // eslint-disable-next-line no-unused-vars
    const [state, setState] = React.useState(initialstate)
    const [alignment, setAlignment] = React.useState('game_average');
    const [dataView, setDataView] = React.useState('players');
    const [formats, setFormats] = React.useState(() => ['core']);// eslint-disable-next-line
    const [rows, setRows] = React.useState([]) // eslint-disable-next-line
    const [columns, setColumns] = React.useState([
        {
            name: 'Title',
            sortable: true,
            selector: row => row.title,
        },
        {
            name: 'Year',
            sortable: true,
            selector: row => row.year,
        },
    ])
    //console.log(state)
    //console.log(alignment)
    //console.log(dataView)
    //console.log(formats)
    const handleChange = (event, props) => {
        //console.log(props.id)
        if (props.id === 'alignment') {
            setAlignment(props.value);
        } else if (props.id === 'dataview') {
            setDataView(props.value)
        }

    };

    const handleFormat = (event, newFormats) => {
        setFormats(newFormats);
    };

    const mvpr = (e) => {
        const rounder = (n) => { return Math.round(n, 3) }
        return (e.goals * 1) + (e.assists * 0.75) + (e.saves * 0.60) + (e.shots / 3)
    }

    //console.log(data[dataView])
    let initMap = stats[dataView].map(item => {
        let statArr = []
        let team = item.team !== undefined ? item.team : item.name
        let base = {
            id: item.name,
            team,
            games: item.cumulative.games,
            wins: item.cumulative.wins,
            win_percentage: item.cumulative.win_percentage
        }
        _.merge(item, {
            game_average: {
                core: {
                    mvpr: mvpr(item.game_average.core)
                }
            }, cumulative: {
                core: {
                    mvpr: mvpr(item.cumulative.core)
                }
            }
        })
        formats.forEach(format => _.assign(statArr, item.[alignment].[format]))
        
        return _.assign(base, statArr)
    })
    //console.log(initMap)

    React.useEffect(() => {
        let headers = initMap !== [] ? _.keys(initMap[0]) : []
        let col = headers !== [] ? headers.map(header => {
            let typeSelect = ['id', 'team'].includes(header) ? 'string' : 'number'
            return { field: header, headerName: header, width: 175, type: typeSelect }
        }) : columns
        //let col = headers !== [] ? headers.map(header => { return { name: header, sortable: true, selector: row => row.[header], } }) : columns

        //console.log(col)
        //console.log(initMap)
        setColumns(col)
        setRows(initMap)
        setState({ ...state, series })
        //console.log(state)


    }, [props, alignment, dataView, formats])

    //console.log(columns)
    //console.log(rows)
    return (
        <div>
            <Paper
                elevation={0}
                sx={{
                    display: 'flex',
                    //border: (theme) => `1px solid ${theme.palette.divider}`,
                    flexWrap: 'wrap',
                }}
            >
                <StyledToggleButtonGroup
                    size="small"
                    value={dataView}
                    onChange={(e) => handleChange(e, e.target)}
                    aria-label="text formatting"
                >
                    <ToggleButton id="dataview" value="players">Players</ToggleButton>
                    <ToggleButton id="dataview" value="teams">Teams</ToggleButton>
                </StyledToggleButtonGroup>
                <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />
                <StyledToggleButtonGroup
                    size="small"
                    value={dataView}
                    onChange={(e) => handleChange(e, e.target)}
                    aria-label="text formatting"
                >
                    <ToggleButton id="dataview" value="players">Players</ToggleButton>
                    <ToggleButton id="dataview" value="teams">Teams</ToggleButton>
                </StyledToggleButtonGroup>
                <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />
                <StyledToggleButtonGroup
                    size="small"
                    value={alignment}
                    exclusive
                    onChange={(e) => handleChange(e, e.target)}
                    aria-label="text alignment"
                >
                    <ToggleButton id="alignment" value="game_average">Averge</ToggleButton>
                    <ToggleButton id="alignment" value="cumulative">Cumulative</ToggleButton>
                </StyledToggleButtonGroup>
                <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />
                <StyledToggleButtonGroup
                    size="small"
                    value={formats}
                    onChange={handleFormat}
                    aria-label="text formatting"
                >
                    <ToggleButton id="format" value="core">Core</ToggleButton>
                    <ToggleButton id="format" value="boost">Boost</ToggleButton>
                    <ToggleButton id="format" value="positioning">Positioning</ToggleButton>
                    <ToggleButton id="format" value="movement">Movement</ToggleButton>
                    <ToggleButton id="format" value="demo">Demos</ToggleButton>
                </StyledToggleButtonGroup>
            </Paper>
            <Divider />
            <ThingsProvider value={[{ rows: rows, columns: columns, series: state.series, control: { alginment: alignment, dataview: dataView, format: formats } }]}>
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <div style={{ height: 850, maxHeight: '100%', width: '100%' }}>
                        <SimpleTable />
                    </div>
                </Box>
                {/*<Divider />
                formats !== [] ? <ColorTabs/> : null*/}
            </ThingsProvider>
        </div>
    );
}