import React from 'react'
import axios from 'axios'

class App extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            chip: "",
            data: [],
            availableData: [],
            filteredData: [],
            selectedData: [],
            isLoaded: false,
            backPress: 0
        }
    }

    componentDidMount(){
        axios.get("https://ruckusae.com/extra/fee/data.php")
            .then(res => {
                this.setState(() => ({
                    data: res.data,
                    availableData: res.data,
                    isLoaded: true
                }))
            })
        window.addEventListener("keydown", this.handleBackSpace)
    }

    handleBackSpace = (e) => {
        const { backPress, selectedData } = this.state
        const value = e.target.value
        if(value === "" && e.keyCode === 8){
            if(backPress === 1){
                const lastItem = selectedData[selectedData.length - 1]

                this.setState((prevState) => ({
                    backPress: 0,
                    selectedData: prevState.selectedData.filter(data => data.id !== lastItem.id),
                    availableData: [...prevState.availableData, lastItem]
                }))
            }else if(backPress === 0){
                this.setState((prevState) => ({
                    backPress: 1,
                    selectedData: prevState.selectedData.map((data,index) => (prevState.selectedData.length - 1) === index ? {...data, ...{select: true}} : data )
                }))
            }else{
                this.setState((prevState) => ({
                    backPress: 1
                }))
            }
        }else{
            this.setState(() => ({
                backPress: 0
            }))
        }
    }

    handleChange = (e) => {
        const value = e.target.value
        this.setState((prevState) => ({
            chip: value,
            filteredData: value.length > 0 ? prevState.availableData.filter(data => data.name.toLowerCase().includes(value.toLowerCase())): []
        }))
        this.handleBackSpace(e)
    }

    handleSelectData = (id) => {
        this.setState((prevState) => ({
            chip: "",
            filteredData: [],
            availableData: prevState.availableData.filter(data => data.id !== id),
            selectedData: [...prevState.selectedData, prevState.data.find(data => data.id === id)]
        }))
    }

    handleRemove = (id) => {
        this.setState((prevState) => ({
            chip: "",
            filteredData: [],
            availableData: [...prevState.availableData, prevState.data.find(data => data.id === id)],
            selectedData: prevState.selectedData.filter(data => data.id !== id)
        }))
    }

    render(){
        const { chip, isLoaded, filteredData, selectedData } = this.state
        return (
            <div className="wrapper">
                { isLoaded && 
                <div className="chipBox">
                    { selectedData.length ?
                        selectedData.map(data => {
                            return (
                                <div key={data.id} className={`selectedChip ${data.select ? 'active' : ''}`}>
                                    <img src={data.image} alt={data.name} />
                                    <label>{data.name}</label>
                                    <button onClick={() => {
                                        this.handleRemove(data.id)
                                    }}>x</button>
                                </div>
                            )
                        }) : ""
                    }
                    
                    <div className="input">
                        <input type="text"
                               placeholder="Type Here"
                               onChange={this.handleChange}
                               value={chip}
                            />

                        <div className="dropdown">
                            <table cellPadding="0" cellSpacing="0">
                                <tbody>
                                    { filteredData.length > 0 ?
                                        filteredData.map(data => {
                                            return (
                                                <tr key={data.id} onClick={() => {
                                                        this.handleSelectData(data.id)
                                                    }}>
                                                    <td><img src={data.image} alt={data.name} /></td>
                                                    <td><label>{data.name}</label></td>
                                                    <td><span>{data.email}</span></td>
                                                </tr>
                                            )
                                        }) : chip.length > 0 &&
                                        <tr>
                                            <td style={{fontSize: '14px', padding: '20px'}}>No Results Found</td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                }
            </div>
        )
    }
}

export default App