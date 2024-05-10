import React from "react";

function Filters({
  deviceId,
  setDeviceId,
  url,
  setUrl,
  duration,
  setDuration,
}) {
  return (
    <div className="filters">
      <input
        type="text"
        placeholder="User Name"
        value={deviceId}
        onChange={(e) => setDeviceId(e.target.value)}
      />
      <input
        type="text"
        placeholder="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <div>
        {["pastHour", "past24Hours", "pastWeek"].map((time) => (
          <label key={time}>
            <input
              type="radio"
              name="duration"
              value={time}
              checked={duration === time}
              onChange={(e) => setDuration(e.target.value)}
            />
            {time.replace(/past(\w)/, (_, firstLetter) =>
              firstLetter.toUpperCase()
            )}
          </label>
        ))}
      </div>
    </div>
  );
}

export default Filters;
