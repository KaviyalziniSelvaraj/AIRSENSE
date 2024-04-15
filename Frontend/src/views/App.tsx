import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Home';
import DefaultLayout from '../Components/DefaultLayout';
import Weather from './Weather';
const App: React.FC = () => {
    
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<DefaultLayout><Home/></DefaultLayout>} />
                    <Route path='/Weather' element={<DefaultLayout><Weather/></DefaultLayout>} />

                </Routes>
            </BrowserRouter>
        </>
    )
}
export default App;