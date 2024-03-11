import axios from "axios";
import { useState, useEffect } from "react";

const App = () => {
    const [date, setDate] = useState("");
    const [rate, setRate] = useState("");
    const [due, setDue] = useState("");
    const [paid, setPaid] = useState("");
    const [builder, setBuilder] = useState("");
    const [location, setLocation] = useState("");
    const [dihari, setDihari] = useState([]);
    const [mainList, setMainList] = useState([]);
    const [builderLocation, setBuilderLocation] = useState({
        builder: [],
        location: []
    });
    const [builderCheckBoxes, setBuilderCheckBox] = useState(null);
    const [locationCheckBoxes, setLocationCheckBox] = useState(null);

    const [Trate, setTrate] = useState(0);
    const [Tpaid, setTpaid] = useState(0);
    const [btn, setBtn] = useState("Insert");
    const [referCode, setReferCode] = useState("");

    const handleSubmit = e => {
        e.preventDefault();
    };
    // if (btn === "Insert") insert();
    //         if (btn === "Update") update();
    //         if (btn === "Delete") deleteTr();
    const insert = async () => {
        try {
            const { data } = await axios.post("/v1/add-hajri", {
                date,
                rate,
                due,
                paid,
                builder,
                location
            });
            console.log({ data });
            getData();
            alert(data.message);
        } catch (err) {
            console.log(err);
        }
    };
    const update = async () => {
        try {
            const { data } = await axios.put("/v1/hajri", {
                referCode,
                data: { date, rate, due, paid, builder, location }
            });
            console.log({ data });
            getData();

            alert(data.message);
        } catch (err) {
            console.log(err);
        }
    };
    const deleteTr = async () => {
        try {
            const yes = confirm(
                "Do you want to Really Delete this day record! "
            );
            if (!yes) return;
            console.log({ referCode });
            const { data } = await axios.put("/v1/hajri-del", {
                referCode
            });
            console.log({ data });
            getData();
            alert(data.message);
        } catch (err) {
            console.log(err);
        }
    };

    const getData = async () => {
        try {
            const { data } = await axios.get("/v1/hajri");
            console.log({ data });
            setMainList(data.dihari);

            setDihari(data.dihari);
            const uniqueBuilder = data.dihari.reduce((unique, obj) => {
                return unique.some(item => item.builder === obj.builder)
                    ? unique
                    : [...unique, obj];
            }, []);
            const obj = {};
            uniqueBuilder.map(element => {
                obj[element.builder] = false;
            });
            setBuilderCheckBox(obj);
            setBuilderLocation(prev => {
                return {
                    ...prev,
                    builder: [...uniqueBuilder]
                };
            });
            const uniqueLocation = data.dihari.reduce((unique, obj) => {
                return unique.some(item => item.location === obj.location)
                    ? unique
                    : [...unique, obj];
            }, []);
            setLocationCheckBox(obj);
            setBuilderLocation(prev => {
                return {
                    ...prev,
                    location: [...uniqueLocation]
                };
            });
        } catch (err) {
            alert(err);
        }
    };

    const handleBuilderBar = event => {
        const { name, checked } = event.target;
        setBuilderCheckBox(prev => ({
            ...prev,
            [name]: checked
        }));
    };
    const handleLocationBar = event => {
        const { name, checked } = event.target;
        setLocationCheckBox(prev => ({
            ...prev,
            [name]: checked
        }));
    };
    const filterApply = () => {
        const filtered = mainList.filter(obj => {
            if (
                builderCheckBoxes[obj.builder] ||
                locationCheckBoxes[obj.location]
            ) {
                return true;
            } else return false;
        });
        const rateOfSum = filtered.reduce((acc, obj) => {
            return acc + +obj.rate;
        }, 0);
        const paidOfSum = filtered.reduce((acc, obj) => {
            return acc + +obj.paid;
        }, 0);
        setTrate(rateOfSum);
        setTpaid(paidOfSum);
        setDihari(filtered);
    };

    const handleBuilderOptionChange = e => {
        const value = e.target.value;
        setBuilder(value);
    };
    const selectTr = ({ referCode, date, rate, paid, builder, location }) => {
        setReferCode(referCode);
        setDate(date);
        setRate(rate);
        setPaid(paid);
        setBuilder(builder);
        setLocation(location);
        setBtn("Update");
    };
    const init = () => {
        getData();
    };
    useEffect(() => {
        setDue(rate - paid);
    }, [paid]);
    useEffect(() => {
        init();
    }, []);
    return (
        <div id="app" className="p-4">
            <h1 className="text-3xl font-bold mb-4">Hajri Attendance</h1>
            <div className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-2">
                    <p className="text-lg font-semibold">Builder</p>
                    {builderCheckBoxes &&
                        builderLocation.builder.map((obj, i) => (
                            <div
                                key={i}
                                className="flex items-center space-x-2"
                            >
                                <input
                                    name={obj.builder}
                                    checked={builderCheckBoxes[obj.builder]}
                                    onChange={handleBuilderBar}
                                    id={`builder-${i}`}
                                    type="checkbox"
                                />
                                <label htmlFor={`builder-${i}`}>
                                    {obj.builder}
                                </label>
                            </div>
                        ))}
                </div>
                <div className="flex flex-col space-y-2">
                    <p className="text-lg font-semibold">Location</p>
                    {locationCheckBoxes &&
                        builderLocation.location.map((obj, i) => (
                            <div
                                key={i}
                                className="flex items-center space-x-2"
                            >
                                <input
                                    name={obj.location}
                                    checked={locationCheckBoxes[obj.location]}
                                    onChange={handleLocationBar}
                                    id={`location-${i}`}
                                    type="checkbox"
                                />
                                <label htmlFor={`location-${i}`}>
                                    {obj.location}
                                </label>
                            </div>
                        ))}
                </div>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={filterApply}
                >
                    Filter Apply
                </button>
            </div>
            <table className="w-full mt-4 border">
                <thead>
                    <tr className=" border border-b-fuchsia-400">
                        <th className="px-4 py-2">Count</th>
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Rate</th>
                        <th className="px-4 py-2">Paid</th>
                        <th className="px-4 py-2">Due</th>
                        <th className="px-4 py-2">Builder Name</th>
                        <th className="px-4 py-2">Location</th>
                    </tr>
                </thead>
                <tbody>
                    {dihari.map((item, i, arr) => (
                        <tr
                            className="hover"
                            key={i}
                            onClick={e => selectTr(item)}
                        >
                            <td className="px-4 py-2">{i + 1}</td>
                            <td className="px-4 py-2">{item.date}</td>
                            <td className="px-4 py-2">{item.rate}</td>
                            <td className="px-4 py-2">{item.paid}</td>
                            <td className="px-4 py-2">
                                {i === arr.length - 1 ? Trate - Tpaid : 0}
                            </td>
                            <td className="px-4 py-2">{item.builder}</td>
                            <td className="px-4 py-2">{item.location}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="form mt-4">
                <p className="text-2xl">One day Details</p>
                <form method="post" onSubmit={handleSubmit}>
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="date" className="text-lg font-semibold">
                            Date:
                        </label>
                        <div className="flex items-center space-x-2">
                            <input
                                onChange={e => setDate(e.target.value)}
                                value={date}
                                type="date"
                                id="date"
                                className="border rounded px-2 py-1"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="rate" className="text-lg font-semibold">
                            Rate (per day):
                        </label>
                        <input
                            onChange={e => setRate(e.target.value)}
                            type="number"
                            id="rate"
                            value={rate}
                            className="border rounded px-2 py-1"
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="paid" className="text-lg font-semibold">
                            Paid Money:
                        </label>
                        <input
                            value={paid}
                            onChange={e => setPaid(e.target.value)}
                            type="number"
                            id="paid"
                            className="border rounded px-2 py-1"
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="due" className="text-lg font-semibold">
                            Due Money:
                        </label>
                        <input
                            onChange={e => setDue(e.target.value)}
                            value={due}
                            type="number"
                            id="due"
                            className="border rounded px-2 py-1"
                        />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label
                            className="text-lg font-semibold"
                            htmlFor="builderOption"
                        >
                            Select Builder or type:
                        </label>
                        <input
                            className="border rounded px-2 py-1"
                            list="builders"
                            id="builderOption"
                            name="builder"
                            value={builder}
                            onChange={handleBuilderOptionChange}
                            placeholder="Builder..."
                        />
                        <datalist id="builders">
                            {mainList.map((obj, index) => {
                                return (
                                    <option key={index} value={obj.builder} />
                                );
                            })}
                        </datalist>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label
                            htmlFor="location"
                            className="text-lg font-semibold"
                        >
                            Location:
                        </label>
                        <input
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                            type="text"
                            id="location"
                            className="border rounded px-2 py-1"
                        />
                    </div>
                    <div className="flex flex-col m-2 space-y-2">
                        <button
                            onClick={insert}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Insert
                        </button>
                        <button
                            onClick={update}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Update
                        </button>
                        <button
                            onClick={deleteTr}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Delete
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default App;
