import { useState } from 'react';
import {
  createTheme, ThemeProvider, CssBaseline, Box, Typography,
  List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  TextField, Button, Grid,
  MenuItem
} from '@mui/material';

import GasStationIcon from '@mui/icons-material/LocalGasStation';
import CarWashIcon from '@mui/icons-material/LocalCarWash';
import BarChartIcon from '@mui/icons-material/BarChart';
import Dashboard from '@mui/icons-material/DashboardOutlined';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0B0F19',
      paper: '#111827',
    },
    primary: {
      main: '#3B82F6'
    },
  },
});

export default function App() {
  const [telaAtual, setTelaAtual] = useState('dashboard');
  const [ModeloCarroLavagem, setModeloCarroLavagem] = useState('');
  const [ModeloCarroCombustivel, setModeloCarroCombustivel] = useState('');

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      {/* Tela inteira com display flex */}
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>

        {/* SIDEBAR (Corrigido: background.paper com 'b' minúsculo) */}
        <Box sx={{ width: 200, bgcolor: 'background.paper', borderRight: '1px solid #1E293B' }}>
          <Typography variant="h6" sx={{fontSize:25, p: 2, fontWeight: 'bold', color: 'primary.main' }}>
            Frota IVRNET
          </Typography>

          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => setTelaAtual('dashboard')}>
                <ListItemIcon><Dashboard color="primary" /></ListItemIcon>
                <ListItemText primary="Dashboard"
                sx={{ '& .MuiListItemText-primary': { fontSize:'20px', fontWeight:'500'}}}/>
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={() => setTelaAtual('combustivel')}>
                <ListItemIcon><GasStationIcon color="primary" /></ListItemIcon>
                <ListItemText primary="Combustível"sx={{ '& .MuiListItemText-primary': { fontSize:'20px', fontWeight:'500'}}} />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={() => setTelaAtual('lavagem')}>
                <ListItemIcon><CarWashIcon color="primary" /></ListItemIcon>
                <ListItemText primary="Lavagem" sx={{ '& .MuiListItemText-primary': { fontSize:'20px', fontWeight:'500'}}}/>
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={() => setTelaAtual('relatorios')}>
                <ListItemIcon><BarChartIcon color="primary" /></ListItemIcon>
                <ListItemText primary="Relatórios" sx={{ '& .MuiListItemText-primary': { fontSize:'20px', fontWeight:'500'}}}/>
              </ListItemButton>
            </ListItem>
          </List>
        </Box>

        {/* CONTEÚDO PRINCIPAL */}
        <Box sx={{ flexGrow: 1, p: 4 }}>

          {/* TELA 1: DASHBOARD */}
          {telaAtual === 'dashboard' && (
            <Box>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>Dashboard Principal</Typography>
              <Typography color="text.secondary">Bem-vindo ao sistema de relatórios de frota</Typography>
            </Box>
          )}

          {/* TELA 2: COMBUSTÍVEL */}
          {telaAtual === 'combustivel' && (
            <Box sx={{
              flexGrow: 1,
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              border: '1px solid #1E293B',
              borderRadius:3,
              bgcolor:'background.paper',
            }}>
              <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
                ⛽ Registrar Combustível
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <TextField fullWidth label="Placa do Veículo" variant="outlined" placeholder="ABC-1234" />
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <TextField fullWidth select label="Modelo do carro" value={ModeloCarroCombustivel} onChange={(e) => setModeloCarroCombustivel(e.target.value)}>
                    <MenuItem value="strada">Fiat Strada</MenuItem>
                    <MenuItem value="mobi">Fiat Mobi</MenuItem>
                    <MenuItem value="saveiro">Volkswagen Saveiro</MenuItem>
                    <MenuItem value="hilux">Toyota Hilux</MenuItem>
                  </TextField>
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <TextField fullWidth label="Quilometragem (KM)" type="number" variant="outlined" />
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <TextField fullWidth label="Litros Abastecidos" type="number" variant="outlined" />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth label="Valor Total (R$)" type="number" variant="outlined" />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Button fullWidth variant="contained" color="primary" size="large" sx={{ mt: 2 }}>
                    Salvar Registro
                  </Button>
                </Grid>
              </Grid> {/* Fechamento correto do container do Grid */}
            </Box>
          )}

          {/* TELA 3: LAVAGEM */}
          {telaAtual === 'lavagem' && (
            <Box sx={{ maxWidth: 600 }}>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                🧼 Registrar Lavagem
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <TextField fullWidth label="Placa do Veículo" variant="outlined" placeholder="ABC-1234" />
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <TextField fullWidth select label="Modelo do carro" value={ModeloCarroLavagem} onChange={(e) => setModeloCarroLavagem(e.target.value)}>
                    <MenuItem value="strada">Fiat Strada</MenuItem>
                    <MenuItem value="mobi">Fiat Mobi</MenuItem>
                    <MenuItem value="saveiro">Volkswagen Saveiro</MenuItem>
                    <MenuItem value="hilux">Toyota Hilux</MenuItem>
                  </TextField>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth label="Quilometragem [KM]" variant="outlined" type="number" />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth label="Valor da Lavagem [R$]" variant="outlined" type="number" />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Button fullWidth variant="contained" color="primary" size="large" sx={{ mt: 2 }}>
                    Salvar Lavagem
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}