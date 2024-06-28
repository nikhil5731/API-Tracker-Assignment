from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import user_agents

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:123456789@localhost/apianalytics"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# API Hit model
class APIHit(Base):
    __tablename__ = "postgres"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    request_type = Column(String)
    endpoint = Column(String)
    user_agent = Column(String)
    operating_system = Column(String)
    ip_address = Column(String)
    request_body = Column(String, nullable=True)


Base.metadata.create_all(bind=engine)


# Middleware to track API hits
@app.middleware("http")
async def track_api_hit(request: Request, call_next):
    db = SessionLocal()
    try:
        # Extract request details
        user_agent_string = request.headers.get("user-agent")
        user_agent = user_agents.parse(user_agent_string)

        api_hit = APIHit(
            request_type=request.method,
            endpoint=request.url.path,
            user_agent=user_agent_string,
            operating_system=user_agent.os.family,
            ip_address=request.client.host,
            request_body=str(await request.body()),
        )
        # db.add(api_hit)
        # db.commit()
    except Exception as e:
        print(f"Error tracking API hit: {e}")
    finally:
        db.close()

    response = await call_next(request)
    return response


# API routes
@app.get("/")
async def root():
    return {"message": "API Hit Tracking System"}


# Dashboard API routes
@app.get("/dashboard/hits")
async def get_api_hits():
    db = SessionLocal()
    hits = db.query(APIHit).all()
    db.close()
    return hits


@app.get("/dashboard/browser_stats")
async def get_browser_stats():
    from collections import defaultdict

    db = SessionLocal()
    try:
        # Query all user agent strings from the database
        results = db.query(APIHit.user_agent).all()
        
        # Parse user agents and count browsers
        browser_counts = defaultdict(int)
        total_hits = 0
        
        for (user_agent_string,) in results:
            user_agent = user_agents.parse(user_agent_string)
            browser_family = user_agent.browser.family
            browser_counts[browser_family] += 1
            total_hits += 1
        
        # Calculate percentages
        browser_stats = {}
        for browser, count in browser_counts.items():
            percentage = (count / total_hits) * 100
            browser_stats[browser] = round(percentage, 2)
        
        # Sort the results by percentage in descending order
        sorted_stats = dict(sorted(browser_stats.items(), key=lambda x: x[1], reverse=True))
        
        return sorted_stats
    
    finally:
        db.close()


from sqlalchemy import func


@app.get("/dashboard/custom_chart")
async def get_custom_chart_data(metric: str):
    db = SessionLocal()
    try:
        if metric == "os":
            data = (
                db.query(APIHit.operating_system, func.count(APIHit.id))
                .group_by(APIHit.operating_system)
                .all()
            )
        elif metric == "method":
            data = (
                db.query(APIHit.request_type, func.count(APIHit.id))
                .group_by(APIHit.request_type)
                .all()
            )
        elif metric == "endpoint":
            data = (
                db.query(APIHit.endpoint, func.count(APIHit.id))
                .group_by(APIHit.endpoint)
                .all()
            )
        elif metric == "user_agent":
            data = (
                db.query(APIHit.user_agent, func.count(APIHit.id))
                .group_by(APIHit.user_agent)
                .all()
            )
        elif metric == "ip":
            data = (
                db.query(APIHit.ip_address, func.count(APIHit.id))
                .group_by(APIHit.ip_address)
                .all()
            )
        else:
            return {"error": "Invalid metric"}

        return {
            "metric": metric,
            "labels": [str(item[0]) for item in data],
            "values": [item[1] for item in data],
        }
    finally:
        db.close()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
