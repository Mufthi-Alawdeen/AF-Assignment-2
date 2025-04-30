import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const CountryModal = ({ show, country, onClose }) => {
    if (!show || !country) return null;

    const {
        name,
        flags,
        capital,
        region,
        subregion,
        population,
        area,
        languages,
        currencies,
        timezones,
        borders,
    } = country;

    return (
        <AnimatePresence>
            {show && (
                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    role="dialog"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                >
                    <motion.div
                        className="modal-dialog modal-xl modal-dialog-centered"
                        role="document"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="modal-content shadow-lg bg-light dark:bg-dark text-dark dark:text-light">
                        <div className="modal-header d-flex justify-content-center position-relative">
    <h3 className="modal-title text-center w-100">{name?.common}</h3>
    <button
        type="button"
        className="btn-close position-absolute end-0 top-50 translate-middle-y me-3"
        onClick={onClose}
    ></button>
</div>

                            <div className="modal-body">
                                <div className="row g-4">
                                    {/* Left column: Details */}
                                    <div className="col-md-6">
                                        <ul className="list-group list-group-flush">
                                            <li className="list-group-item">
                                                <strong>Capital:</strong> {capital?.[0] || "N/A"}
                                            </li>
                                            <li className="list-group-item">
                                                <strong>Region:</strong> {region} ({subregion})
                                            </li>
                                            <li className="list-group-item">
                                                <strong>Population:</strong> {population.toLocaleString()}
                                            </li>
                                            <li className="list-group-item">
                                                <strong>Area:</strong> {area?.toLocaleString()} km²
                                            </li>
                                            <li className="list-group-item">
                                                <strong>Languages:</strong> {languages ? Object.values(languages).join(", ") : "N/A"}
                                            </li>
                                            <li className="list-group-item">
                                                <strong>Currencies:</strong> {currencies ? Object.values(currencies).map(cur => cur.name).join(", ") : "N/A"}
                                            </li>
                                            <li className="list-group-item">
                                                <strong>Timezones:</strong> {timezones?.join(", ")}
                                            </li>
                                            <li className="list-group-item">
                                                <strong>Borders:</strong> {borders ? borders.join(", ") : "None"}
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Right column: Flag only */}
                                    <div className="col-md-6 d-flex align-items-center justify-content-center">
                                        <img
                                            src={flags?.png}
                                            alt={name?.common}
                                            className="img-fluid rounded border"
                                            style={{ maxHeight: "300px", objectFit: "contain" }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={onClose}>Close</button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CountryModal;
